const adjectives = [
  "Swift",
  "Silent",
  "Crafty",
  "Bold",
  "Slick",
  "Clever",
  "Sly",
  "Nimble",
  "Shrewd",
  "Cunning",
  "Sharp",
  "Daring",
  "Stealthy",
  "Wily",
  "Keen",
];

const colors = [
  "Crimson",
  "Shadow",
  "Phantom",
  "Silver",
  "Golden",
  "Cobalt",
  "Scarlet",
  "Azure",
  "Obsidian",
  "Amber",
  "Onyx",
  "Ivory",
  "Indigo",
  "Violet",
  "Jade",
];

const animals = [
  "Fox",
  "Wolf",
  "Hawk",
  "Lynx",
  "Raven",
  "Viper",
  "Falcon",
  "Jaguar",
  "Cobra",
  "Panther",
  "Badger",
  "Weasel",
  "Otter",
  "Ferret",
  "Gecko",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCodename(): string {
  return pick(adjectives) + pick(colors) + pick(animals);
}
