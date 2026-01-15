import AdminJS from 'adminjs';
import AdminJSSequelize from '@adminjs/sequelize';
import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';

import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { ImageCarousel } from '../models/ImageCarousel.js';
import { CartItem } from '../models/CartItem.js';
import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';

import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendInvoiceEmail } from '../utils/emailSender.js';
import { InvoiceItem } from '../types/InvoiceItems.js';


AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

export const adminJs = new AdminJS({
  rootPath: '/admin',
  resources: [
    Product,
    Review,
    User,
    Category,
    ImageCarousel,
    CartItem,
    Payment,
    {
      resource: Order,
      options: {
        actions: {
          approve: {
            actionType: 'record',
            icon: 'Checkmark',
            label: '✅ Approve & Email',
            guard: 'Approve this order and email invoice?',
            handler: async (
              _req: ActionRequest,
              _res: ActionResponse,
              context: ActionContext
            ) => {
              const { record, currentAdmin } = context;

              if (!record) {
                throw new Error('Order record not found');
              }

              if (!currentAdmin || currentAdmin.role !== 'admin') {
                return {
                  record: record.toJSON(),
                  notice: {
                    message: '❌ Only admins can approve orders',
                    type: 'error',
                  },
                };
              }

              // Approve selected order
              await record.update({ status: 'approved' });

              const orderData = record.params;

              const user = await User.findOne({
                where: { uid: orderData.user_uid },
              });

              if (!user?.email) {
                return {
                  record: record.toJSON(),
                  notice: {
                    message: '❌ User not found or missing email',
                    type: 'error',
                  },
                };
              }

              const approvedOrders: Order[] = await Order.findAll({
                where: {
                  user_uid: orderData.user_uid,
                  status: 'approved',
                },
              });

              const invoiceItems: InvoiceItem[] = approvedOrders.map(
                (order: Order): InvoiceItem => ({
                  productId: String(order.product_id),
                  img_url: order.img_url,
                  quantity: order.quantity,
                  price: Number(order.price),
                })
              );

              const total = invoiceItems.reduce(
                (sum: number, item: InvoiceItem) => sum + item.price,
                0
              );

              const invoicePath = `./invoices/invoice-${orderData.user_uid}-${Date.now()}.pdf`;

              await generateInvoicePDF(invoiceItems, total, invoicePath);
              await sendInvoiceEmail(user.email, invoicePath);

              return {
                record: record.toJSON(),
                notice: {
                  message: '✅ Order approved & invoice emailed',
                  type: 'success',
                },
              };
            },
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'Smart Cart',
  },
});

export default adminJs;
