class EagerSingleton {
	private static instance: EagerSingleton = new EagerSingleton();

	private constructor() {
		console.log('Instance created');
	}

	public static getInstance(): EagerSingleton {
		return EagerSingleton.instance;
	}
}

console.log('Starting...');

const a = EagerSingleton.getInstance();
const b = EagerSingleton.getInstance();

console.log(a === b);
