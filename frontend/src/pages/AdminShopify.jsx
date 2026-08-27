import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownToLine, CheckCircle2, XCircle } from 'lucide-react';
import { shopifyAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../components/ui/sonner';
import { Toaster } from '../components/ui/sonner';

const AdminShopify = () => {
  const [status, setStatus] = useState(null);
  const [domain, setDomain] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState(localStorage.getItem('shopify_admin_key') || '');
  const [adminToken, setAdminToken] = useState('');
  const [storefrontToken, setStorefrontToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadStatus = async () => {
    try {
      const data = await shopifyAPI.getSettings();
      setStatus(data);
      if (data.domain) setDomain(data.domain);
    } catch (error) {
      toast.error('Could not load Shopify connection status.');
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!domain || !adminToken) {
      toast.error('Store domain and Admin API access token are required.');
      return;
    }
    if (!adminKeyInput) {
      toast.error('Enter your admin panel key to save changes.');
      return;
    }
    localStorage.setItem('shopify_admin_key', adminKeyInput);
    setSaving(true);
    try {
      await shopifyAPI.saveSettings({
        domain,
        admin_access_token: adminToken,
        storefront_access_token: storefrontToken || undefined,
      });
      toast.success('Shopify credentials saved.');
      setAdminToken('');
      setStorefrontToken('');
      await loadStatus();
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to save Shopify credentials.');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!adminKeyInput) {
      toast.error('Enter your admin panel key to disconnect.');
      return;
    }
    localStorage.setItem('shopify_admin_key', adminKeyInput);
    setDisconnecting(true);
    try {
      await shopifyAPI.disconnect();
      toast.success('Shopify disconnected.');
      setDomain('');
      await loadStatus();
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to disconnect Shopify.');
    } finally {
      setDisconnecting(false);
    }
  };

  const pollJobStatus = async (getStatus, onDone, onError) => {
    for (let i = 0; i < 150; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      let statusData;
      try {
        statusData = await getStatus();
      } catch (error) {
        onError(error?.response?.data?.detail || 'Lost connection while checking progress.');
        return;
      }
      if (statusData.status === 'done') {
        onDone(statusData.result);
        return;
      }
      if (statusData.status === 'error') {
        onError(statusData.error || 'Operation failed.');
        return;
      }
    }
    onError('This is taking longer than expected. Check back in a moment.');
  };

  const handlePush = async () => {
    if (!adminKeyInput) {
      toast.error('Enter your admin panel key first.');
      return;
    }
    localStorage.setItem('shopify_admin_key', adminKeyInput);
    setPushing(true);
    try {
      await shopifyAPI.push();
      toast.info('Push started — this can take a minute for large catalogues.');
      await pollJobStatus(
        shopifyAPI.getPushStatus,
        (result) => {
          const imgNote = result.skipped_images?.length ? ` (${result.skipped_images.length} products pushed without an image — invalid/local image URL)` : '';
          toast.success(`Pushed to Shopify: ${result.created} created, ${result.updated} updated${result.failed?.length ? `, ${result.failed.length} failed` : ''}.${imgNote}`);
          setPushing(false);
          loadStatus();
        },
        (message) => {
          toast.error(message);
          setPushing(false);
        }
      );
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to start push to Shopify.');
      setPushing(false);
    }
  };

  const handleSync = async () => {
    if (!adminKeyInput) {
      toast.error('Enter your admin panel key first.');
      return;
    }
    localStorage.setItem('shopify_admin_key', adminKeyInput);
    setSyncing(true);
    try {
      await shopifyAPI.sync();
      toast.info('Sync started — this can take a minute for large catalogues.');
      await pollJobStatus(
        shopifyAPI.getSyncStatus,
        (result) => {
          const skipNote = result.skipped?.length ? ` (${result.skipped.length} products skipped due to bad data)` : '';
          toast.success(`Synced ${result.synced} products from Shopify.${skipNote} Shopify is now your product source of truth.`);
          setSyncing(false);
          loadStatus();
        },
        (message) => {
          toast.error(message);
          setSyncing(false);
        }
      );
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to start sync from Shopify.');
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-16 md:py-24" data-testid="admin-shopify-page">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.4em] uppercase text-amber-700 mb-3">Manage Panel</p>
        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">Shopify Integration</h1>
        <p className="text-sm text-stone-500 mb-10">
          Connect your Shopify store to push products, sync your catalogue, and route checkout through Shopify.
        </p>

        {/* Connection status */}
        <div className="bg-white border border-stone-200 rounded-sm p-6 mb-8" data-testid="shopify-status-card">
          <div className="flex items-center gap-2 mb-1">
            {status?.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-stone-400" />
            )}
            <span className="text-sm font-medium text-stone-900">
              {status?.connected ? `Connected — ${status.domain}` : 'Not connected'}
            </span>
          </div>
          {status?.last_pushed_at && (
            <p className="text-xs text-stone-500">Last pushed to Shopify: {new Date(status.last_pushed_at).toLocaleString()}</p>
          )}
          {status?.last_synced_at && (
            <p className="text-xs text-stone-500">Last synced from Shopify: {new Date(status.last_synced_at).toLocaleString()}</p>
          )}
          {!status?.has_storefront_token && status?.connected && (
            <p className="text-xs text-amber-700 mt-2">Add a Storefront Access Token below to enable in-app checkout.</p>
          )}
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-sm p-6 mb-8 space-y-5">
          <div>
            <Label htmlFor="shopify-admin-key">Admin Panel Key</Label>
            <Input
              id="shopify-admin-key"
              data-testid="shopify-admin-key-input"
              type="password"
              placeholder="Your ADMIN_PANEL_KEY"
              value={adminKeyInput}
              onChange={(e) => setAdminKeyInput(e.target.value)}
              className="mt-1.5"
            />
            <p className="text-xs text-stone-500 mt-1.5">
              Set once in backend/.env as ADMIN_PANEL_KEY — required to save credentials or run sync.
            </p>
          </div>
          <div>
            <Label htmlFor="shopify-domain">Store Domain</Label>
            <Input
              id="shopify-domain"
              data-testid="shopify-domain-input"
              placeholder="yourstore.myshopify.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="shopify-admin-token">Admin API Access Token</Label>
            <Input
              id="shopify-admin-token"
              data-testid="shopify-admin-token-input"
              type="password"
              placeholder="shpat_..."
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="mt-1.5"
            />
            <p className="text-xs text-stone-500 mt-1.5">
              Shopify Admin → Settings → Apps and sales channels → Develop apps → your app → API credentials.
            </p>
          </div>
          <div>
            <Label htmlFor="shopify-storefront-token">Storefront Access Token (optional, for in-app checkout)</Label>
            <Input
              id="shopify-storefront-token"
              data-testid="shopify-storefront-token-input"
              type="password"
              placeholder="shpss_... or Storefront token"
              value={storefrontToken}
              onChange={(e) => setStorefrontToken(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              data-testid="shopify-save-settings-btn"
              disabled={saving}
              className="bg-stone-900 hover:bg-black text-white rounded-none uppercase text-xs tracking-wider px-6 py-5"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </Button>
            {status?.connected && (
              <Button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                data-testid="shopify-disconnect-btn"
                variant="outline"
                className="rounded-none uppercase text-xs tracking-wider px-6 py-5"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Store'}
              </Button>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={handlePush}
            disabled={pushing || !status?.connected}
            data-testid="shopify-push-btn"
            className="flex flex-col items-start gap-3 bg-white border border-stone-200 rounded-sm p-6 text-left hover:border-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpRight className="w-5 h-5 text-stone-700" />
            <span className="text-sm font-medium text-stone-900">
              {pushing ? 'Pushing...' : 'Push My Products to Shopify'}
            </span>
            <span className="text-xs text-stone-500">Create/update all 47 local products in your Shopify store.</span>
          </button>

          <button
            onClick={handleSync}
            disabled={syncing || !status?.connected}
            data-testid="shopify-sync-btn"
            className="flex flex-col items-start gap-3 bg-white border border-stone-200 rounded-sm p-6 text-left hover:border-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownToLine className="w-5 h-5 text-stone-700" />
            <span className="text-sm font-medium text-stone-900">
              {syncing ? 'Syncing...' : 'Sync From Shopify'}
            </span>
            <span className="text-xs text-stone-500">Replace our catalogue with the latest from Shopify (source of truth).</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminShopify;
