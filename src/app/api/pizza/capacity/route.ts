import { NextResponse } from 'next/server';
import { isKitchenAuthenticated } from '@/lib/pizza-orders/auth';
import {
  getStore,
  updateCapacity,
  updateOpeningStatus,
  updateOrderPage,
  updateSiteAnnouncement,
  updateWebsiteContent,
} from '@/lib/pizza-orders/store';

export async function GET() {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  const store = await getStore();
  return NextResponse.json({
    capacity: store.capacity,
    orderPage: store.orderPage,
    openingStatus: store.openingStatus,
    siteAnnouncement: store.siteAnnouncement,
    websiteContent: store.websiteContent,
    remaining: store.remaining,
    reserved: store.capacity.maxPizzas - store.remaining,
  });
}

export async function PATCH(request: Request) {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  const body = await request.json();
  const capacity = await updateCapacity(body);
  const orderPage = await updateOrderPage(body.orderPage ?? {});
  const openingStatus = await updateOpeningStatus(body.openingStatus ?? {});
  const siteAnnouncement = await updateSiteAnnouncement(body.siteAnnouncement ?? {});
  const websiteContent = await updateWebsiteContent(body.websiteContent ?? {});
  const store = await getStore();

  return NextResponse.json({
    capacity,
    orderPage,
    openingStatus,
    siteAnnouncement,
    websiteContent,
    remaining: store.remaining,
  });
}
