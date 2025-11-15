import { Color, ColumnInput, MarginPaddingInput, RowInput } from "jspdf-autotable";

export interface ITableHeaderActions {
  searchPlaceholder?: string;
  hasSearch?: boolean;
  hasExport?: boolean;
  hasDateRangeFilter?: boolean;
  hasCustomAction?: boolean;
}


export interface LineWidths {
	"bottom": number;
	"top": number;
	"left": number;
	"right": number;
}
export interface IStyles {
	font: "helvetica" | "times" | "courier" | string;
	fontStyle: "normal" | "bold" | "italic" | "bolditalic" | string;
	overflow: "linebreak" | "ellipsize" | "visible" | "hidden" | Function;
	fillColor: Color;
	textColor: Color;
	halign: "left" | "center" | "right" | "justify";
	valign: "top" | "middle" | "bottom";
	fontSize: number;
	cellPadding: MarginPaddingInput;
	lineColor: Color;
	lineWidth: number | Partial<LineWidths>;
	cellWidth: "auto" | "wrap" | number;
	minCellHeight: number;
	minCellWidth: number;
}
export interface IUserOptions {
	includeHiddenHtml?: boolean;
	useCss?: boolean;
	theme?: "striped" | "grid" | "plain" | null;
	startY?: number | false;
	margin?: MarginPaddingInput;
	pageBreak?: "auto" | "avoid" | "always";
	rowPageBreak?: "auto" | "avoid";
	tableWidth?: "auto" | "wrap" | number;
	showHead?: "everyPage" | "firstPage" | "never" | boolean;
	showFoot?: "everyPage" | "lastPage" | "never" | boolean;
	tableLineWidth?: number;
	tableLineColor?: Color;
	tableId?: string | number;
	head?: RowInput[];
	body?: RowInput[];
	foot?: RowInput[];
	html?: string | HTMLTableElement;
	columns?: ColumnInput[];
	horizontalPageBreak?: boolean;
	styles?: Partial<any>;
	bodyStyles?: Partial<any>;
	headStyles?: Partial<any>;
	footStyles?: Partial<any>;
	alternateRowStyles?: Partial<any>;
	columnStyles?: {
		[key: string]: Partial<any>;
	}
}
