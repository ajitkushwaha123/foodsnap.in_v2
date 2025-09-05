import mongoose, { Schema } from "mongoose";

const SidebarSubItemSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const SidebarItemSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, default: "#" },
  icon: { type: String },
  isActive: { type: Boolean, default: false },
  items: [SidebarSubItemSchema],
});

const SidebarSchema = new Schema({
  role: { type: String, enum: ["user", "admin"], required: true },
  navMain: [SidebarItemSchema],
});

const Sidebar =
  mongoose.models.Sidebar || mongoose.model("Sidebar", SidebarSchema);

export default Sidebar;
