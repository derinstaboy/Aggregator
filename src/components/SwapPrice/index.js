import React, { useEffect, useState, useCallback } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { BigNumber, ethers } from "ethers";
import {
  defaultTokens,
  mmfContract,
  ebisusContract,
  vssContract,
  croDexContract,
  tokenContract,
  factoryContract,
  allPaths,
} from "../helperConstants";
import { useSigner, useProvider } from "wagmi";
import { findMax } from "../helperFunctions";
import value from "../../value.json";

export default function SwapPrice({
  userInput,
  setOutPutTokens,
  setConvertToken,
  isCro,
  setParameters,
  reload,
  tokens,
  setTokens,
  setTokenBalance,
  setIsDataLoading,
}) {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [finalAmount, setFinalAmount] = useState(0);
  const [router, setRouter] = useState(null);
  const [finalPath, setFinalPath] = useState([tokens.token1, tokens.token2]);
  const [pairs, setPairs] = useState([]);
  const [balance, setBalance] = useState(0);
  const [routerFinalPath, setRouterFinalPath] = useState([]);

  useEffect(() => {
    if (tokens.token1 === tokens.token2) {
      setOutPutTokens(userInput);
    } else {
      setOutPutTokens(userInput * finalAmount);
    }
  }, [userInput, tokens, finalAmount]);

  const getAmountsOutFromDex = async (path, amountsIn, contract) => {
    try {
      const val = await contract.getAmountsOut(amountsIn, path);
      return val[val.length - 1]._hex.toString();
    } catch (e) {
      return "0";
    }
  };

  const getAllAmountsFromDex = async (path, amountsIn, dexContracts) => {
    const temp = [tokens.token1, ...path, tokens.token2];
    const actions = dexContracts.map((contract) =>
      getAmountsOutFromDex(temp, amountsIn, contract)
    );
    return Promise.all(actions);
  };

  const getFinalAmount = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const _provider = provider || new ethers.providers.JsonRpcProvider(value.rpcUrl);
      const dexContracts = [
        mmfContract(_provider),
        croDexContract(_provider),
        vssContract(_provider),
        ebisusContract(_provider),
      ];
      const token1Contract = tokenContract(_provider, tokens.token1);
      const deci1 = await token1Contract.decimals();
      const inputBigNumber = BigNumber.from(1).mul(BigNumber.from(10).pow(deci1));
      const token2Contract = tokenContract(_provider, tokens.token2);
      const deci2 = await token2Contract.decimals();

      const multiAction = allPaths.map((path) =>
        getAllAmountsFromDex(path, inputBigNumber, dexContracts)
      );
      const results = await Promise.all(multiAction);
      const item = findMax(results);
      const result = parseFloat(ethers.utils.formatUnits(item[0], deci2));

      setFinalAmount(result);
      setConvertToken(result);
      setRouter(dexContracts[item[2]]);
      const tempPath = [tokens.token1, ...allPaths[item[1]], tokens.token2];
      setFinalPath(tempPath);
      setRouterFinalPath([dexContracts[item[2]], tempPath]);
    } catch (e) {
      console.error(e);
    }
    setIsDataLoading(false);
  }, [tokens, provider, setIsDataLoading, setConvertToken]);

  useEffect(() => {
    getFinalAmount();
  }, [getFinalAmount, tokens, reload, isCro]);

  useEffect(() => {
    const _provider = provider || new ethers.providers.JsonRpcProvider(value.rpcUrl);
    const findPairs = async () => {
      try {
        const factory = await routerFinalPath[0].factory();
        const factoryRouter = factoryContract(_provider, factory);
        const temp = await Promise.all(
          routerFinalPath[1].slice(0, -1).map((token, i) =>
            factoryRouter.getPair(token, routerFinalPath[1][i + 1])
          )
        );
        setPairs(temp);
      } catch (e) {
        console.error(e);
      }
    };

    if (routerFinalPath[0] && routerFinalPath[1]) {
      findPairs();
    }
  }, [routerFinalPath, provider]);

  const getBalance = useCallback(async () => {
    try {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const address = await _provider.getSigner().getAddress();
      const token1Contract = tokenContract(_provider, tokens.token1);
      let balance1;

      if (isCro) {
        balance1 = await _provider.getBalance(address);
      } else {
        balance1 = await token1Contract.balanceOf(address);
      }

      setBalance(balance1);
      const decimalsHere = await token1Contract.decimals();
      const temp = ethers.utils.formatUnits(balance1._hex, decimalsHere);
      setTokenBalance(parseFloat(temp).toFixed(5));
    } catch (e) {
      console.error("Error in fetching Balance", e);
    }
  }, [tokens.token1, isCro, setTokenBalance]);

  useEffect(() => {
    if (window.ethereum) {
      getBalance();
    }
  }, [tokens.token1, reload, isCro, getBalance]);

  useEffect(() => {
    setParameters([balance, router, finalPath, pairs]);
  }, [balance, router, finalPath, pairs, setParameters]);

  return (
    <div>
      <div>{/* Any necessary UI components */}</div>
    </div>
  );
}
