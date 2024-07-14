import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const gender = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  gender: gender("gender").notNull(),
  avatar: text("avatar"),
  isAdmin: boolean("is_admin").notNull(),
  socialLinks: text("social_links"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
}));

export const addresses = pgTable("adress", {
  id: serial("id").primaryKey().notNull(),
  userId: serial("user_id").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  street: text("street").notNull(),
  postalCode: text("postal_code").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  description: text("description").notNull(),
  image: text("image")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  video: text("video").notNull(),
  stock: integer("stock").notNull(),
  ratingsQuantity: integer("ratings").notNull(),
  averageRating: doublePrecision("average_rating").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey().notNull(),
  productId: serial("product_id").notNull(),
  userId: serial("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey().notNull(),
  productId: serial("product_id").notNull(),
  userId: serial("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const wishlistRelations = relations(wishlists, ({ one }) => ({
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
}));

export const likes = pgTable("likes", {
  id: serial("id").primaryKey().notNull(),
  productId: serial("product_id").notNull(),
  userId: serial("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const likeRelations = relations(likes, ({ one }) => ({
  product: one(products, {
    fields: [likes.productId],
    references: [products.id],
  }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey().notNull(),
  userId: serial("user_id").notNull(),
  productId: serial("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  shippingAddressesId: serial("shipping_addresses_id").notNull(),
  status: text("status").notNull(),
  isPaid: boolean("is_paid").notNull(),
  isDelivered: boolean("is_delivered").notNull(),
  paidAt: timestamp("paid_at"),
  paymentMethod: text("payment_method").notNull(),
  deliveredAt: timestamp("delivered_at"),
  paymentResult: text("payment_result").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const shippingAddresses = pgTable("shipping_addresses", {
  id: serial("id").primaryKey().notNull(),
  orderId: serial("order_id").notNull(),
  addressId: serial("address_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  address: one(addresses, {
    fields: [orders.shippingAddressesId],
    references: [addresses.id],
  }),
  shippingAddress: one(shippingAddresses, {
    fields: [orders.id],
    references: [shippingAddresses.orderId],
  }),
}));

export const shippingAddressesRelations = relations(
  shippingAddresses,
  ({ one }) => ({
    order: one(orders, {
      fields: [shippingAddresses.orderId],
      references: [orders.id],
    }),
  })
);

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey().notNull(),
  userId: serial("user_id").notNull(),
  productId: serial("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey().notNull(),
  userId: serial("user_id").notNull(),
  orderId: serial("order_id").notNull(),
  status: text("status").notNull(),
  productId: serial("on_product_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  time: timestamp("time").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  readTime: integer("read_time").notNull(),
  userId: serial("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogRelations = relations(blogs, ({ one }) => ({
  user: one(users, { fields: [blogs.userId], references: [users.id] }),
}));

export const blogComments = pgTable("comments", {
  id: serial("id").primaryKey().notNull(),
  content: text("content").notNull(),
  userId: serial("user_id").notNull(),
  blogId: serial("blog_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogCommentRelations = relations(blogComments, ({ one }) => ({
  user: one(users, { fields: [blogComments.userId], references: [users.id] }),
  blog: one(blogs, {
    fields: [blogComments.blogId],
    references: [blogs.id],
  }),
}));
