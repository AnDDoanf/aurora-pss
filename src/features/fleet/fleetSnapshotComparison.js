export const compareFleetMembers = (firstMembers = [], secondMembers = []) => {
  const firstById = new Map(firstMembers.map((member) => [String(member.id), member]));
  const secondById = new Map(secondMembers.map((member) => [String(member.id), member]));

  const joined = secondMembers.filter((member) => !firstById.has(String(member.id)));
  const left = firstMembers.filter((member) => !secondById.has(String(member.id)));
  const retained = secondMembers.filter((member) => firstById.has(String(member.id)));

  return {
    firstCount: firstMembers.length,
    secondCount: secondMembers.length,
    changedCount: joined.length + left.length,
    joined,
    left,
    retained
  };
};
