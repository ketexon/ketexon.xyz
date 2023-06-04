import { getNoteNameFrequency, noteNameToNumber } from "~/util/audio/notes"

export abstract class SynthCube {
	constructor(protected ctx: AudioContext){}

	abstract get master(): AudioNode

	activate(){}

	deactivate(){}

	connect(node: AudioNode | AudioParam){}
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
	oscillator: OscillatorNode;

	constructor(ctx: AudioContext, settings?: OscillatorSynthCubeSettings){
		super(ctx, settings?.synthGainCubeSettings);

		const {type, frequency, note} = settings || {};
		this.oscillator = new OscillatorNode(
			ctx,
			{
				type: type || "sine",
				frequency: note ? getNoteNameFrequency(note) : frequency
			}
		)
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

const MAX_VOLUME = 0.5;

export class Synth {
	audioContext?: AudioContext;
	master?: GainNode;
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
		this.master = new GainNode(this.audioContext, {gain: this.volume * MAX_VOLUME});
		this.master.connect(this.audioContext.destination);

		this.nodes = new Array(6).fill(0).map(() => new Array(6).fill(null));

		this.nodes[0][0] = new OscillatorSynthCube(this.audioContext, {note: "A0", synthGainCubeSettings: {
			gain: 0.5
		}});

		this.nodes[0][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
		});

		this.nodes[0][0].connect(this.nodes[0][1].master);
		this.nodes[0][1].connect(this.master);



		this.nodes[1][0] = new OscillatorSynthCube(this.audioContext, {note: "E1"});

		this.nodes[1][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
		});

		this.nodes[1][0].connect(this.nodes[1][1].master);
		this.nodes[1][1].connect(this.master);



		this.nodes[2][0] = new OscillatorSynthCube(this.audioContext, {note: "A1"});

		this.nodes[2][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
		});

		this.nodes[2][0].connect(this.nodes[2][1].master);
		this.nodes[2][1].connect(this.master);



		this.nodes[3][0] = new OscillatorSynthCube(this.audioContext, {note: "E2"});

		this.nodes[3][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
			type: "sine"
		});

		this.nodes[3][0].connect(this.nodes[3][1].master);
		this.nodes[3][1].connect(this.master);



		this.nodes[4][0] = new OscillatorSynthCube(this.audioContext, {note: "A2"});

		this.nodes[4][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
		});

		this.nodes[4][0].connect(this.nodes[4][1].master);
		this.nodes[4][1].connect(this.master);




		this.nodes[5][0] = new OscillatorSynthCube(this.audioContext, {note: "E3"});

		this.nodes[5][1] = new LFOGainSynthCube(this.audioContext, {
			amplitude: 0.5,
			center: 0.5,
		});

		this.nodes[5][0].connect(this.nodes[5][1].master);
		this.nodes[5][1].connect(this.master);
	}

	pressCube([x, z]: [number, number]){
		this.nodes[x][z]?.activate();
	}

	unpressCube([x, z]: [number, number]){
		this.nodes[x][z]?.deactivate();
	}

	set volume(value: number) {
		this._volume = value;
		if(this.master){
			this.master.gain.value = value;
		}
	}

	get volume() { return this._volume; }
}