// https://en.wikipedia.org/wiki/Piano_key_frequencies

import memoizeOne from "memoize-one";

export function getNoteNameFrequency(name: string): number {
	return getNoteFrequency(noteNameToNumber(name));
}

export function getNoteFrequency(n: number): number {
	return Math.pow(2, (n - 49)/12)*440
}

export const noteNameToNumber = memoizeOne((name: string): number => {
	const match = name.match(/^([a-gA-G])(#|b)?(\d+)$/);
	if(match){
		const [_, note, accidental, octaveStr] = match;
		let noteIndex = (note.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)) * 2;
		if(noteIndex >= 10) --noteIndex;
		if(noteIndex >= 4) --noteIndex;
		if(accidental === "b") --noteIndex;
		if(accidental === "#") ++noteIndex;

		let octave = parseInt(octaveStr);
		if(noteIndex > 2) --octave;

		return 12 * octave + noteIndex + 1;
	}
	return -1;
})

export function getNoteHarmonic(note: number, harmonic: number){
	return note * harmonic
}

export function getNoteNameHarmonic(note: string, harmonic: number){
	return noteNameToNumber(note) * harmonic
}