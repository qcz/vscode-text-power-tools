import classifyPoint from "robust-point-in-polygon";
import * as vscode from "vscode";
import { Boundary, CONTINENT_BOUNDARIES, Continent } from "../../helpers/continents";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "../sequenceTypes";

interface BoundingBox {
	minLat: number;
	minLon: number;
	maxLat: number;
	maxLon: number;
};

export class RandomCoordinatesSequence extends ASequenceBase {
	private boundaries: Boundary[];
	private boundingBox: BoundingBox | null = null;

	constructor(private continent?: Continent) {
		super();

		this.boundaries = continent && CONTINENT_BOUNDARIES[continent]
			? CONTINENT_BOUNDARIES[continent]
			: [];

		if (this.boundaries.length > 0) {
			this.calculateBoundingBox();
		}
	}

	private calculateBoundingBox() {
		this.boundingBox = {
			minLat: 90,
			maxLat: -90,
			minLon: 180,
			maxLon: -180
		};

		for (const boundary of this.boundaries) {
			for (const coordinates of boundary) {
				if (coordinates[0] < this.boundingBox.minLat) {
					this.boundingBox.minLat = coordinates[0];
				}
				if (coordinates[0] > this.boundingBox.maxLat) {
					this.boundingBox.maxLat = coordinates[0];
				}

				if (coordinates[1] < this.boundingBox.minLon) {
					this.boundingBox.minLon = coordinates[1];
				}
				if (coordinates[1] > this.boundingBox.maxLon) {
					this.boundingBox.maxLon = coordinates[1];
				}
			}
		}
	}

	public get icon(): string {
		return "location";
	}

	public get order(): number {
		return 1;
	}

	public get name(): string {
		if (this.continent) {
			const continentName = this.continent === "Africa" ? vscode.l10n.t("Africa")
				: this.continent === "Asia" ? vscode.l10n.t("Asia")
				: this.continent === "Europe" ? vscode.l10n.t("Europe")
				: this.continent === "NorthAmerica" ? vscode.l10n.t("North America")
				: vscode.l10n.t("South America");

			return vscode.l10n.t("Random WGS84 coordinates from {0}", continentName);
		}

		return vscode.l10n.t("Random WGS84 coordinates");
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal();
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal();
	}

	public async createGeneratorFunctionInternal() : Promise<StringIteratorGeneratorFunction> {
		var self = this;
		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem();
			}
		};

		return fun;
	}

	public generateRandomItem(): string {
		let latitude: number;
		let longitude: number;

		if (this.boundingBox != null) {
			while (true) {
				latitude = Math.random() * (this.boundingBox.maxLat - this.boundingBox.minLat) + this.boundingBox.minLat;
				longitude = Math.random() * (this.boundingBox.maxLon - this.boundingBox.minLon) + this.boundingBox.minLon;

				if (this.boundaries.find(x => classifyPoint(x, [latitude, longitude]) !== 1)) {
					break;
				}
			}
		} else {
			latitude = Math.random() * 180 - 90;
			longitude = Math.random() * 360 - 180;
		}

		return latitude.toFixed(6) + ", " + longitude.toFixed(6);
	}
}
