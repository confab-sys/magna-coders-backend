export async function placeBid(projectModel: any, projectId: string, bidderId: string, amount: number, proposal: string) {
  if (amount <= 0) throw new Error('Bid amount must be greater than 0');
  if (!proposal?.trim()) throw new Error('Proposal is required');
  return await projectModel.placeBid(projectId, bidderId, amount, proposal);
}

export async function acceptBid(projectModel: any, projectId: string, bidId: string, clientId: string) {
  return await projectModel.acceptBid(projectId, bidId, clientId);
}