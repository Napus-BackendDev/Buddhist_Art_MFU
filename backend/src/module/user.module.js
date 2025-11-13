import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: Map, of: String, default: {} },
  password: { type: String, default: "" },
  email: { type: Map, of: String, default: {} },
  studentId: { type: String, default: "" },
  tel: { type: String, default: "" },
  photo: { type: String, default: "" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  arts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Arts" }],
  }, { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const hashedPassword = await bcrypt.hash(update.password, 10);
    this.setUpdate({ ...update, password: hashedPassword });
  }
  next();
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
