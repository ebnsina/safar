import {
	Airplane01Icon,
	Alert02Icon,
	ArrowDataTransferHorizontalIcon,
	ArrowLeft02Icon,
	ArrowRight02Icon,
	Bus01Icon,
	Calendar03Icon,
	Cancel01Icon,
	CheckmarkCircle02Icon,
	Clock01Icon,
	CreditCardIcon,
	InformationCircleIcon,
	Location01Icon,
	Moon02Icon,
	Refresh01Icon,
	Search01Icon,
	StarIcon,
	Sun03Icon,
	Ticket01Icon,
	Tick02Icon,
	Train01Icon,
	UserMultipleIcon,
	Wallet01Icon
} from '@hugeicons/core-free-icons';
import type { TransportMode } from '#lib/domain/modes';

/** Every icon the app uses, named for its job rather than its shape. */
export const ICONS = {
	bus: Bus01Icon,
	train: Train01Icon,
	air: Airplane01Icon,
	search: Search01Icon,
	forward: ArrowRight02Icon,
	back: ArrowLeft02Icon,
	swap: ArrowDataTransferHorizontalIcon,
	place: Location01Icon,
	travellers: UserMultipleIcon,
	date: Calendar03Icon,
	rating: StarIcon,
	duration: Clock01Icon,
	included: Tick02Icon,
	confirmed: CheckmarkCircle02Icon,
	ticket: Ticket01Icon,
	warning: Alert02Icon,
	info: InformationCircleIcon,
	clear: Cancel01Icon,
	reset: Refresh01Icon,
	card: CreditCardIcon,
	wallet: Wallet01Icon,
	light: Sun03Icon,
	dark: Moon02Icon
} as const;

export const MODE_ICONS: Record<TransportMode, (typeof ICONS)[keyof typeof ICONS]> = {
	bus: ICONS.bus,
	train: ICONS.train,
	air: ICONS.air
};
