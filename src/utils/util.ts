export const getDefaultImage = (name: string) => {
	const firstName = name.split(' ')[0];
	const size = 60;
	const background = 'f0f0f0';
	const color = '444';
	const url = 'https://ui-avatars.com/api/';

	return `${url}?name=${firstName}&length=1&size=${size}&background=${background}&color=${color}`;
};
export const flatten = (arr: any[], depth = 1) =>
	arr.reduce(
		(a, v) =>
			a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
		[],
	);
export const splitArray = (arr: any[], number: number) =>
	arr.reduce(
		(acc, val, index) => {
			if ((index + 1) % number === 0) {
				acc[1]++;
				acc[0].push([]);
			}
			acc[0][acc[1]].push(val);
			return acc;
		},
		[[[]], 0],
	)[0];
