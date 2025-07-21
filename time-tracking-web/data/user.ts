import prisma from '@/db/db';

export const getUserByEmail = async (email: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { subscriptions: true },
  });

  return existingUser;
};

export const getUserById = async (id: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  return existingUser;
};

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
      },
    });

    return account;
  } catch {
    return null;
  }
};
