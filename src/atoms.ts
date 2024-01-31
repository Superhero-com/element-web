import { atomWithStorage } from "jotai/utils";
import { getDefaultStore } from "jotai/index";

type TokenThreshold = {
    threshold: string;
    symbol: string;
};

export type BareUser = {
    userId: string;
    rawDisplayName: string;
};

type BotAccounts = {
    communityBot: string;
    superheroBot: string;
    blockchainBot: string;
};


export const verifiedAccountsAtom = atomWithStorage<Record<string, string>>("VERIFIED_ACCOUNTS", {});
export const botAccountsAtom = atomWithStorage<BotAccounts | null>("BOT_ACCOUNTS", null);
export const minimumTokenThresholdAtom = atomWithStorage<Record<string, TokenThreshold>>("TOKEN_THRESHOLD", {});
export const communityBotAtom = atomWithStorage<BareUser>("COMMUNITY_BOT", {
    userId: "",
    rawDisplayName: "",
});

export function getBotAccountData()  {
    const defaultStore = getDefaultStore();
    return defaultStore.get(botAccountsAtom) as BotAccounts | null;
}
