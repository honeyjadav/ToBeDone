import mongoose from "mongoose";
import crypto from "crypto";

const ENCRYPTION_KEY =
  process.env.CHAT_ENCRYPTION_KEY ||
  process.env.ACCESS_TOKEN_SECRET ||
  "tobedone-chat-encryption-key-32-bytes";
const KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();

export function encryptChatText(value) {
  if (typeof value !== "string" || value.length === 0) {
    return value;
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `enc:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptChatText(value) {
  if (typeof value !== "string" || !value.startsWith("enc:")) {
    return value;
  }

  try {
    const [, ivBase64, tagBase64, encryptedBase64] = value.split(":");

    if (!ivBase64 || !tagBase64 || !encryptedBase64) {
      return value;
    }

    const iv = Buffer.from(ivBase64, "base64");
    const tag = Buffer.from(tagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.warn("Failed to decrypt chat message content:", error.message);
    return value;
  }
}

const decryptContentTransform = (doc, ret) => {
  if (ret && typeof ret.content === "string") {
    ret.content = decryptChatText(ret.content);
  }
  return ret;
};

const messageSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    channel: {
      type: String,
      default: "general",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    isSystem: { type: Boolean, default: false },
    systemMeta: {
      type: {
        type: String,
        enum: ["member_removed", "member_left", "member_added"],
      },
      actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      targetId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.set("toJSON", { transform: decryptContentTransform });
messageSchema.set("toObject", { transform: decryptContentTransform });

messageSchema.pre("save", async function () {
  if (this.isModified("content") && typeof this.content === "string") {
    this.content = encryptChatText(this.content);
  }
});

messageSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], async function () {
  const update = this.getUpdate ? this.getUpdate() : this._update;

  if (update && typeof update === "object") {
    if (update.$set && typeof update.$set.content === "string") {
      update.$set.content = encryptChatText(update.$set.content);
    }
    if (update.content && typeof update.content === "string") {
      update.content = encryptChatText(update.content);
    }
  }
});

messageSchema.post("init", function () {
  this.content = decryptChatText(this.content);
});

messageSchema.index({ workspace: 1, channel: 1, createdAt: -1 });
messageSchema.index({ workspace: 1, sender: 1, recipient: 1, createdAt: -1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;