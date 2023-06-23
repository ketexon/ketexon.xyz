import { getNoteNameFrequency, getNoteNameHarmonic, noteNameToNumber } from "~/util/audio/notes"

export abstract class SynthCube {
	constructor(protected ctx: AudioContext){}

	abstract get master(): AudioNode

	activate(){}

	deactivate(){}

	connect(node: AudioNode | AudioParam){}
}

export type MultiSynthCubeSettings = {
	cubes: SynthCube[]
}

export class MultiSynthCube extends SynthCube {
	multiSettings: MultiSynthCubeSettings;
	cubes: SynthCube[];

	constructor(ctx: AudioContext, settings?: Partial<MultiSynthCubeSettings>){
		super(ctx);
		this.multiSettings = {
			cubes: settings?.cubes || []
		}

		this.cubes = this.multiSettings.cubes;
	}

	get master(): AudioNode {
		return null as unknown as AudioNode;
	}

	activate(): void {
		for(const cube of this.cubes){
			cube.activate();
		}
	}

	deactivate(): void {
		for(const cube of this.cubes){
			cube.deactivate();
		}
	}
}

export type SynthGainCubeSettings = {
	gainAttackSpeed: number,
	gainDecaySpeed: number,
	gain: number,
}

export class SynthGainCube extends SynthCube {
	gainNode: GainNode
	modulatorGainNode: GainNode

	gainSettings: SynthGainCubeSettings

	constructor(ctx: AudioContext, settings?: Partial<SynthGainCubeSettings>){
		super(ctx);
		this.modulatorGainNode = new GainNode(
			this.ctx,
			{
				gain: 0,
			}
		)
		this.gainNode = new GainNode(
			this.ctx,
			{
				gain: 0,
			}
		)

		this.modulatorGainNode.connect(this.gainNode)

		this.gainSettings = {
			gainAttackSpeed: settings?.gainAttackSpeed || 0.5,
			gainDecaySpeed: settings?.gainDecaySpeed || 0.3,
			gain: settings?.gain || 0.5,
		}
	}

	get master(): AudioNode {
		return this.gainNode
	}

	activate(){
		this.gainNode.gain.setTargetAtTime(
			this.gainSettings.gain,
			this.ctx.currentTime,
			this.gainSettings.gainAttackSpeed
		)
	}

	deactivate(){
		this.gainNode.gain.setTargetAtTime(
			0,
			this.ctx.currentTime,
			this.gainSettings.gainDecaySpeed
		)
	}

	connect(node: AudioNode){
		this.master.connect(node);
	}
}


export type OscillatorSynthCubeSettings = {
	type?: OscillatorType,
	frequency?: number,
	note?: string,
	synthGainCubeSettings?: Partial<SynthGainCubeSettings>
}

export class OscillatorSynthCube extends SynthGainCube {
	frequencySource: ConstantSourceNode;
	frequencyGain: GainNode;
	oscillator: OscillatorNode;

	constructor(ctx: AudioContext, settings?: OscillatorSynthCubeSettings){
		super(ctx, settings?.synthGainCubeSettings);

		const {type, frequency, note} = settings || {};
		this.oscillator = new OscillatorNode(ctx, {
			type: type || "sine",
			frequency: note !== undefined ? getNoteNameFrequency(note) : frequency
		})

		this.frequencySource = new ConstantSourceNode(ctx, {offset: note !== undefined ? getNoteNameFrequency(note) : frequency})
		this.frequencySource.start()

		this.frequencyGain = new GainNode(ctx, {gain: 1});

		this.frequencySource.connect(this.frequencyGain)

		this.frequencyGain.connect(this.oscillator.frequency)

		this.oscillator.start();
		this.oscillator.connect(super.master);
	}
}

export type LFOSynthCubeSettings = {
	type: OscillatorType,
	frequency: number,
	center: number,
	amplitude: number,

	modulatorGainAttack: number,
	modulatorGainDecay: number,
}

export class LFOGainSynthCube extends SynthCube {
	modulator: OscillatorNode;
	constantSource: ConstantSourceNode;
	modulatorGain: GainNode;
	gain: GainNode

	lfoSettings: LFOSynthCubeSettings;

	get master(): AudioNode {
		return this.gain;
	}

	constructor(ctx: AudioContext, settings?: Partial<LFOSynthCubeSettings>){
		super(ctx)

		this.lfoSettings = {
			type: settings?.type || "sine",
			frequency: settings?.frequency === undefined ? 1 : settings?.frequency,
			center: settings?.center === undefined ? 1 : settings?.center,
			amplitude: settings?.amplitude === undefined ? 0.5 : settings?.amplitude,
			modulatorGainAttack: settings?.modulatorGainAttack || 0.5,
			modulatorGainDecay: settings?.modulatorGainDecay || 0.3,
		}

		this.modulator = new OscillatorNode(ctx, {
			frequency: this.lfoSettings.frequency,
			type: this.lfoSettings.type
		})

		this.constantSource = new ConstantSourceNode(ctx, {
			offset: this.lfoSettings.center
		})
		this.modulator.start()
		this.constantSource.start();

		this.modulatorGain = new GainNode(ctx, {
			gain: 0
		})

		this.modulator.connect(this.modulatorGain)

		this.gain = new GainNode(ctx)
		this.constantSource.connect(this.gain.gain)
		this.modulatorGain.connect(this.gain.gain)
	}

	activate(): void {
		this.modulatorGain.gain.setTargetAtTime(
			this.lfoSettings.amplitude,
			this.ctx.currentTime,
			this.lfoSettings.modulatorGainAttack
		)
	}

	deactivate(): void {
		this.modulatorGain.gain.setTargetAtTime(
			0,
			this.ctx.currentTime,
			this.lfoSettings.modulatorGainDecay
		)
	}

	connect(node: AudioNode): void {
		this.gain.connect(node)
	}
}

export type LFOFMSynthCubeSettings = {
	type: OscillatorType,
	frequency: number,
	center: number,
	amplitude: number,

	modulatorGainAttack: number,
	modulatorGainDecay: number,
}

export class LFOFMSynthCube extends SynthCube {
	modulator: OscillatorNode;
	constantSource: ConstantSourceNode;
	modulatorGain: GainNode;
	gain: GainNode

	lfoSettings: LFOFMSynthCubeSettings;

	get master(): AudioNode {
		return this.gain;
	}

	constructor(ctx: AudioContext, settings?: Partial<LFOFMSynthCubeSettings>){
		super(ctx)

		this.lfoSettings = {
			type: settings?.type || "sine",
			frequency: settings?.frequency === undefined ? 1 : settings?.frequency,
			center: settings?.center === undefined ? 1 : settings?.center,
			amplitude: settings?.amplitude === undefined ? 0.5 : settings?.amplitude,
			modulatorGainAttack: settings?.modulatorGainAttack || 0.5,
			modulatorGainDecay: settings?.modulatorGainDecay || 0.3,
		}

		this.modulator = new OscillatorNode(ctx, {
			frequency: this.lfoSettings.frequency,
			type: this.lfoSettings.type
		})

		this.constantSource = new ConstantSourceNode(ctx, {
			offset: this.lfoSettings.center
		})
		this.modulator.start()
		this.constantSource.start();

		this.modulatorGain = new GainNode(ctx, {
			gain: 0
		})

		this.modulator.connect(this.modulatorGain)

		this.gain = new GainNode(ctx)
		this.constantSource.connect(this.gain.gain)
		this.modulatorGain.connect(this.gain.gain)
	}

	activate(): void {
		this.modulatorGain.gain.setTargetAtTime(
			this.lfoSettings.amplitude,
			this.ctx.currentTime,
			this.lfoSettings.modulatorGainAttack
		)
	}

	deactivate(): void {
		this.modulatorGain.gain.setTargetAtTime(
			0,
			this.ctx.currentTime,
			this.lfoSettings.modulatorGainDecay
		)
	}

	connect(node: AudioParam): void {
		this.gain.connect(node)
	}
}

const MAX_VOLUME = 0.1;

export class Synth {
	audioContext?: AudioContext;
	masterGain?: GainNode;
	masterCompressor?: DynamicsCompressorNode;
	private _volume: number = 0.5;

	nodes: (SynthCube | null)[][];

	constructor(){}

	close(){
		this.audioContext?.close();
	}

	ensureContext(){
		if(this.audioContext === undefined){
			this.init();
		}
	}

	private init(){
		this.audioContext = new AudioContext();
		this.masterGain = new GainNode(this.audioContext);
		this.volume = this._volume;

		this.masterCompressor = new DynamicsCompressorNode(this.audioContext, {
			knee: 20,
			threshold: -30
		})
		this.masterGain.connect(this.masterCompressor);
		this.masterCompressor.connect(this.audioContext.destination);

		this.nodes = new Array(6).fill(0).map(() => new Array(6).fill(null));

		this.nodes[0][0] = new OscillatorSynthCube(this.audioContext, {note: "A1", synthGainCubeSettings: {gain: 1}});
		this.nodes[1][0] = new OscillatorSynthCube(this.audioContext, {note: "A2", synthGainCubeSettings: {gain: 1}});
		this.nodes[2][0] = new OscillatorSynthCube(this.audioContext, {note: "E3", synthGainCubeSettings: {gain: 0.75}});
		this.nodes[3][0] = new OscillatorSynthCube(this.audioContext, {note: "A3", synthGainCubeSettings: {gain: 0.5}});
		this.nodes[4][0] = new OscillatorSynthCube(this.audioContext, {note: "C#4", synthGainCubeSettings: {gain: 0.5}});
		this.nodes[5][0] = new OscillatorSynthCube(this.audioContext, {note: "E4", synthGainCubeSettings: {gain: 0.5}});


		this.nodes[0][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 1.5,
			center: 1,
		});
		this.nodes[0][0].connect(this.nodes[0][1].master);
		this.nodes[1][0].connect(this.nodes[0][1].master);
		this.nodes[2][0].connect(this.nodes[0][1].master);

		this.nodes[0][1].connect(this.masterGain);



		this.nodes[1][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 1,
			center: 1,
		});
		this.nodes[3][0].connect(this.nodes[1][1].master);
		this.nodes[4][0].connect(this.nodes[1][1].master);
		this.nodes[5][0].connect(this.nodes[1][1].master);

		this.nodes[1][1].connect(this.masterGain);



		const cube21 = this.nodes[2][1] = new MultiSynthCube(this.audioContext, {
			cubes: [
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 2}
				}),
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 4}
				}),
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 6}
				})
			]
		});

		cube21.cubes[0].connect((this.nodes[0][0] as OscillatorSynthCube).frequencyGain)
		cube21.cubes[1].connect((this.nodes[1][0] as OscillatorSynthCube).frequencyGain)
		cube21.cubes[2].connect((this.nodes[2][0] as OscillatorSynthCube).frequencyGain)



		const cube31 = this.nodes[3][1] = new MultiSynthCube(this.audioContext, {
			cubes: [
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 8}
				}),
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 10}
				}),
				new OscillatorSynthCube(this.audioContext, {
					frequency: 1,
					synthGainCubeSettings: {gain: 12}
				})
			]
		});

		cube31.cubes[0].connect((this.nodes[3][0] as OscillatorSynthCube).frequencyGain)
		cube31.cubes[1].connect((this.nodes[4][0] as OscillatorSynthCube).frequencyGain)
		cube31.cubes[2].connect((this.nodes[5][0] as OscillatorSynthCube).frequencyGain)

		// this.nodes[2][1].connect((this.nodes[5][0] as OscillatorSynthCube).oscillator.frequency)
		// const lfo = new OscillatorNode(this.audioContext, {frequency: 1});
		// lfo.start()

		// const lfoGain = new GainNode(this.audioContext, {gain: 2});
		// lfo.connect(lfoGain);

		// lfoGain.connect((this.nodes[2][0] as OscillatorSynthCube).frequencyGain)
	}

	pressCube([x, z]: [number, number]){
		this.nodes[x][z]?.activate();
	}

	unpressCube([x, z]: [number, number]){
		this.nodes[x][z]?.deactivate();
	}

	set volume(value: number) {
		this._volume = value;
		if(this.masterGain){
			this.masterGain.gain.value = value * MAX_VOLUME;
		}
	}

	get volume() { return this._volume; }
}