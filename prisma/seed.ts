import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        nickname: "张三",
        content: "校园网速度太慢了，看视频经常卡顿，希望能改善！",
      },
    }),
    prisma.message.create({
      data: {
        nickname: "李四",
        content: "图书馆的WiFi信号很差，经常断连，学习体验很不好。",
      },
    }),
    prisma.message.create({
      data: {
        nickname: "王五",
        content: "宿舍网络晚上12点就断了，有时候需要熬夜写论文很不方便。",
      },
    }),
  ]);

  console.log("Created messages:", messages);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
