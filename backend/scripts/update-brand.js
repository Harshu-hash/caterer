// One-off: update the live SiteSettings document's business name/contact info
// to match the real business, without touching other collections.
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import SiteSettings from '../src/models/SiteSettings.js';

async function main() {
  await connectDB();
  const existing = await SiteSettings.findOne({});
  if (!existing) {
    console.log('No SiteSettings document found; nothing to update.');
  } else {
    existing.businessName = 'Shree Sanware Sarkar Caters and Supervision';
    if (!existing.contact.phone) existing.contact.phone = '+91 78699 55446';
    if (!existing.contact.email) existing.contact.email = 'shriSanwaresarkar@gmail.com';
    if (!existing.contact.whatsApp) existing.contact.whatsApp = '+917869955446';
    if (!existing.address) existing.address = '131-A, Jawahar Nagar, Main Road, Ratlam (M.P.)';
    if (existing.defaultSeo?.title?.includes('Saffron')) {
      existing.defaultSeo.title = 'Shree Sanware Sarkar Caters and Supervision | Premium Indian Catering & Events';
    }
    await existing.save();
    console.log('Updated SiteSettings businessName to:', existing.businessName);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
