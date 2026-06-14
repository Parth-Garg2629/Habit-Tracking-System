export function getDefaultQuests() {
  return [
    {
      title: "Code for 30 minutes",
      description: "Write code on any project for at least 30 minutes",
      xpReward: 15,
      isDaily: true,
    },
    {
      title: "Solve a coding problem",
      description: "Complete a LeetCode, HackerRank, or similar challenge",
      xpReward: 25,
      isDaily: true,
    },
    {
      title: "Read documentation",
      description: "Read docs or technical articles for 20 minutes",
      xpReward: 10,
      isDaily: true,
    },
    {
      title: "Write a daily log",
      description: "Reflect on what you learned today",
      xpReward: 10,
      isDaily: true,
    },
    {
      title: "Push a commit",
      description: "Make meaningful progress and push code",
      xpReward: 15,
      isDaily: true,
    },
  ];
}
