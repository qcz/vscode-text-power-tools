import * as vscode from "vscode";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "../sequenceTypes";

const LOWERCASE_CHAR_TABLE: string = "0123456789abcdef";

export enum IpAddressType {
	Ipv4,
	Ipv6
}

export class RandomIpAdressesSequence extends ASequenceBase {
	public get name(): string {
		if (this.type === IpAddressType.Ipv4) {
			return vscode.l10n.t("Random IPv4 adresses");
		} else {
			return vscode.l10n.t("Random IPv6 adresses");
		}
	}

	public get icon(): string {
		return "globe";
	}

	public get order(): number {
		return 9500;
	}

	constructor(
		private type: IpAddressType
	) {
		super();
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal();
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal();
	}

	public async createGeneratorFunctionInternal()
		: Promise<StringIteratorGeneratorFunction> {
		const self = this;

		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem();
			}
		};

		return fun;
	}

	public generateRandomItem(): string {
		if (this.type === IpAddressType.Ipv4) {
			return this.generateRandomIpV4Address();
		}

		return this.generateRandomIpV6Address();
	}

	private generateRandomIpV4Address(): string {
		return [1, 2, 3, 4].map(() => Math.floor(Math.random() * 255)).join(".");
	}

	private generateRandomIpV6Address() {
		const finalFullyQualifiedAddress = [1, 2, 3, 4, 5, 6, 7, 8].map(() => {
			let ret = [1, 2, 3, 4].map(() => LOWERCASE_CHAR_TABLE[Math.floor(Math.random() * 16)]).join("");
			ret = ret.replace(/^0+([1-9a-f]*[0-9a-f])$/, "$1");
			return ret;
		}).join(":");

		return finalFullyQualifiedAddress.replace(/(:?0:(?:0:){1,})/, "::");
	}
}
