export const randomUpTo = (max) => {
  return Math.floor(Math.random() * (max + 1));
};

export const percentageCalc = (sampleCount, totalCount) => {
 return sampleCount / totalCount * 100;
};

export const roundedPercentage = (sampleCount, totalCount) => {
  const percentage = percentageCalc(sampleCount, totalCount);
  const roundedPercentage = Math.round(percentage * 100) / 100;
  return roundedPercentage;
};