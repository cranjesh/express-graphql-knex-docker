export const authenticate = async (userId: string, password: string): Promise<boolean> =>
  userId === 'euc' && password === 'euc';
