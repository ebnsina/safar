export const TRANSPORT_MODES = ['bus', 'train', 'air'] as const;

export type TransportMode = (typeof TRANSPORT_MODES)[number];

export interface ModeDescriptor {
	mode: TransportMode;
	label: string;
	/** Plural noun for the vehicle, used in headings and empty states. */
	vehicles: string;
	/** What a boarding point is called in this mode. */
	stopLabel: string;
	seatLabel: string;
	maxSeatsPerBooking: number;
}

export const MODES: Record<TransportMode, ModeDescriptor> = {
	bus: {
		mode: 'bus',
		label: 'Bus',
		vehicles: 'buses',
		stopLabel: 'Counter',
		seatLabel: 'Seat',
		maxSeatsPerBooking: 4
	},
	train: {
		mode: 'train',
		label: 'Train',
		vehicles: 'trains',
		stopLabel: 'Station',
		seatLabel: 'Seat',
		maxSeatsPerBooking: 4
	},
	air: {
		mode: 'air',
		label: 'Flight',
		vehicles: 'flights',
		stopLabel: 'Airport',
		seatLabel: 'Seat',
		maxSeatsPerBooking: 9
	}
};

export function isTransportMode(value: unknown): value is TransportMode {
	return typeof value === 'string' && TRANSPORT_MODES.includes(value as TransportMode);
}

export function describeMode(mode: TransportMode): ModeDescriptor {
	return MODES[mode];
}
