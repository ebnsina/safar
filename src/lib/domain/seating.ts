import type { TransportMode } from './modes';
import { noise } from './random';

export type SeatStatus = 'available' | 'sold' | 'held' | 'blocked' | 'selected';

/** Where a seat sits relative to the aisle — drives the icons and filters travellers see. */
export type SeatPosition = 'window' | 'aisle' | 'middle';

export interface FareClassSpec {
	code: string;
	name: string;
	/** Applied to the trip's base fare to price this class. */
	multiplier: number;
	baggageKg: number;
	refundable: boolean;
	perks: readonly string[];
}

export interface DeckSection {
	classCode: string;
	fromRow: number;
	toRow: number;
}

export interface DeckSpec {
	id: string;
	label: string;
	/** Seat letters left to right; `null` marks the aisle gap. */
	columns: readonly (string | null)[];
	rows: number;
	sections: readonly DeckSection[];
	/** Seat codes that do not physically exist on this deck. */
	omit?: readonly string[];
	/** Rows sitting beside a boarding door or emergency exit. */
	exitRows?: readonly number[];
	/** Rows with extra legroom, because nothing reclines in front of them. */
	legroomRows?: readonly number[];
}

export interface SeatLayout {
	id: string;
	mode: TransportMode;
	name: string;
	/** Buses have decks, trains have coaches, aircraft have one cabin. */
	deckLabel: string;
	decks: readonly DeckSpec[];
	classes: readonly FareClassSpec[];
}

export interface Seat {
	code: string;
	deckId: string;
	row: number;
	column: string;
	classCode: string;
	position: SeatPosition;
	status: SeatStatus;
	priceMinor: number;
}

export interface DeckSeats {
	deck: DeckSpec;
	/** Rows of cells; `null` is the aisle gap so the grid renders without extra logic. */
	rows: (Seat | null)[][];
}

export interface SeatMap {
	layout: SeatLayout;
	decks: DeckSeats[];
	totalSeats: number;
	availableSeats: number;
}

export function totalCapacity(layout: SeatLayout): number {
	return layout.decks.reduce((sum, deck) => {
		const perRow = deck.columns.filter(Boolean).length;
		return sum + deck.rows * perRow - (deck.omit?.length ?? 0);
	}, 0);
}

export function findClass(layout: SeatLayout, code: string): FareClassSpec | undefined {
	return layout.classes.find((c) => c.code === code);
}

function classForRow(deck: DeckSpec, row: number): string {
	const section = deck.sections.find((s) => row >= s.fromRow && row <= s.toRow);
	return section?.classCode ?? deck.sections[0].classCode;
}

function positionOf(columns: readonly (string | null)[], index: number): SeatPosition {
	const isEdge = index === 0 || index === columns.length - 1;
	if (isEdge) return 'window';
	const nextToAisle = columns[index - 1] === null || columns[index + 1] === null;
	return nextToAisle ? 'aisle' : 'middle';
}

export function fareForClass(baseFareMinor: number, spec: FareClassSpec): number {
	// Round to whole currency units so quoted fares never show stray paisa.
	return Math.round((baseFareMinor * spec.multiplier) / 100) * 100;
}

export interface SeatMapInput {
	layout: SeatLayout;
	baseFareMinor: number;
	/** Stable per-trip seed; the same trip always yields the same occupancy. */
	seed: number;
	/** Seats already sold or on hold, from the bookings tables. */
	takenSeats?: Iterable<string>;
	/** 0–1 share of seats that seed data treats as already sold. */
	occupancy?: number;
}

/**
 * Rebuilds a trip's seat map from its layout and seed. Persisted bookings are layered on
 * top, so real reservations always win over generated occupancy.
 */
export function buildSeatMap({
	layout,
	baseFareMinor,
	seed,
	takenSeats,
	occupancy = 0
}: SeatMapInput): SeatMap {
	const taken = new Set(takenSeats ?? []);
	const priceByClass = new Map(
		layout.classes.map((spec) => [spec.code, fareForClass(baseFareMinor, spec)])
	);

	let totalSeats = 0;
	let availableSeats = 0;

	const decks = layout.decks.map((deck) => {
		const omitted = new Set(deck.omit ?? []);
		const rows: (Seat | null)[][] = [];

		for (let row = 1; row <= deck.rows; row++) {
			const cells: (Seat | null)[] = deck.columns.map((column, index) => {
				if (column === null) return null;

				const code = `${deck.id === 'main' ? '' : `${deck.id}-`}${row}${column}`;
				if (omitted.has(code)) return null;

				const classCode = classForRow(deck, row);
				totalSeats++;

				let status: SeatStatus = 'available';
				if (taken.has(code)) status = 'sold';
				else if (noise(seed, code) < occupancy) status = 'sold';
				else availableSeats++;

				return {
					code,
					deckId: deck.id,
					row,
					column,
					classCode,
					position: positionOf(deck.columns, index),
					status,
					priceMinor: priceByClass.get(classCode) ?? baseFareMinor
				};
			});

			rows.push(cells);
		}

		return { deck, rows };
	});

	return { layout, decks, totalSeats, availableSeats };
}

export function collectSeats(map: SeatMap): Seat[] {
	return map.decks.flatMap((deck) =>
		deck.rows.flat().filter((seat): seat is Seat => seat !== null)
	);
}

export function findSeat(map: SeatMap, code: string): Seat | undefined {
	return collectSeats(map).find((seat) => seat.code === code);
}
