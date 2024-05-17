import React, { useState, useEffect, useCallback } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  tokenMap,
  tokenContract,
  aggregatorContract,
  WCroContract,
  tokenMap2,
} from "../helperConstants";
import {
  checkAllowance,
  checkAllowanceForWithdrawal,
} from "../helperFunctions";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import "./style.css";

// Image Imports
import refreshLogo from "../assets/images/refresh.svg";
import setting from "../assets/images/setting.svg";
import backBtn from "../assets/images/back-button.svg";
import lionImage from "../assets/images/lion.svg";
import InfoLogo from "../assets/images/info.svg";
import arrowWStroke from "../assets/images/arrowwstroke.svg";
import swapIcon from "../assets/images/swapIcon.svg";
import searchIcon from "../assets/images/searchIcon.svg";
import ethIcon from "../assets/images/ethIcon.svg";
import highlightedpin from "../assets/images/highlightedPin.svg";
import { ReactComponent as LegacyIcon } from "../assets/images/legacyIcon.svg";
import { Lottie1, Lottie1Dark } from "../Lottie";

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const HomePage = (props) => {
  const {
    setUserInput,
    userInput,
    outPutTokens,
    convertToken,
    setIsCro,
    parameters,
    isCro,
    setReload,
    reload,
    setTokens,
    tokens,
    tokenBalance,
    isDataLoading,
  } = props;

  const { data: signer } = useSigner();

  const [slippage1, setSlippage1] = useState(1);
  const [deadline, setDeadline] = useState(20);
  const [expanded, setExpanded] = useState(false);
  const [selectToken, setSelectToken] = useState(false);
  const [selectToken1, setSelectToken1] = useState(false);
  const [selectToken2, setSelectToken2] = useState(false);
  const [searchValue1, setSearchValue1] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [selectedToken1, setSelectedToken1] = useState("WCRO");
  const [selectedToken2, setSelectedToken2] = useState("CRK");
  const [isSetting, setIsSetting] = useState(false);
  const [slippage, setSlippage] = useState(4);
  const [selectedIcon1, setSelectedIcon1] = useState(
    <img src={require(`../assets/images/webP/cronos.webp`)} alt="icon" />
  );
  const [selectedIcon2, setSelectedIcon2] = useState(
    <img src={require(`../assets/images/webP/croking.webp`)} alt="icon" />
  );
  const [isRotating, setIsRotating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fastTxn, setFastTxn] = useState(false);
  const [isOutputCro, setIsOutputCro] = useState(false);
  const [searchBarValue1, setSearchBarValue1] = useState(<div></div>);
  const [searchBarValue2, setSearchBarValue2] = useState(<div></div>);
  const [searchBarValueList1, setSearchBarValueList1] = useState(<div></div>);
  const [searchBarValueList2, setSearchBarValueList2] = useState(<div></div>);

  const handleRefreshClick = () => {
    setIsRotating(true);
    setReload((state) => !state);
    setTimeout(() => setIsRotating(false), 500);
  };

  const getUserWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const address = await provider.getSigner().getAddress();
      return [address, provider.getSigner()];
    } catch (e) {
      console.error(e);
      return ["", ""];
    }
  };

  const handleSwap = async () => {
    setIsDisabled(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (parseFloat(userInput) === 0) {
      notyf.error("Add input Amount");
      setIsDisabled(false);
      return;
    }
    const feeData = await provider.getFeeData();
    const finalGasPrice = fastTxn ? feeData.maxPriorityFeePerGas : feeData.lastBaseFeePerGas;

    if ((isCro && selectedToken2 === "WCRO") || (isOutputCro && selectedToken1 === "WCRO")) {
      const [address, signer] = await getUserWallet();
      if (!address || !signer) {
        notyf.error("Please Reconnect Your Wallet and Try Again");
        setIsDisabled(false);
        return;
      }
      try {
        const croRouter = WCroContract(signer, tokenMap[0][0]);
        const decimals = await croRouter.decimals();
        const bigUserInput = ethers.utils.parseUnits(userInput.toString(), decimals);
        if (isCro && selectedToken2 === "WCRO") {
          const croBalance = await provider.getBalance(address);
          if (croBalance.lt(bigUserInput)) {
            notyf.error("Insufficient Balance");
            setIsDisabled(false);
            return;
          }
          const response = await croRouter.deposit({ value: bigUserInput });
          await response.wait();
        } else if (isOutputCro && selectedToken1 === "WCRO") {
          await checkAllowanceForWithdrawal(tokens.token1, address, signer, bigUserInput);
          const wcroBalance = await croRouter.balanceOf(address);
          if (wcroBalance.lt(bigUserInput)) {
            notyf.error("Insufficient Balance");
            setIsDisabled(false);
            return;
          }
          const response = await croRouter.withdraw(bigUserInput);
          await response.wait();
        }
        notyf.success("Transaction Successful");
        setReload((state) => !state);
      } catch (e) {
        notyf.error("Something Went Wrong");
        console.error(e);
      }
      setIsDisabled(false);
      return;
    }

    if (parameters.length === 4) {
      const [address, signer] = await getUserWallet();
      if (!address || !signer) {
        notyf.error("Please Reconnect Your Wallet and Try Again");
        setIsDisabled(false);
        return;
      }
      const balance = parameters[0]._hex;
      const router = parameters[1];
      const finalPath = parameters[2];
      const pairs = parameters[3];
      const tokenRouter = tokenContract(provider, tokens.token1);
      const outPutTokenRouter = tokenContract(provider, tokens.token2);
      const decimals = await tokenRouter.decimals();
      const bigUserInput = ethers.utils.parseUnits(userInput.toString(), decimals);
      if (!isCro) {
        await checkAllowance(tokens.token1, address, signer, bigUserInput);
      }
      if (BigNumber.from(bigUserInput).lt(balance)) {
        const outDecimals = await outPutTokenRouter.decimals();
        const bigOut = ethers.utils.parseUnits(outPutTokens.toFixed(outDecimals).toString(), outDecimals);
        const temp = parseInt((100 - parseFloat(slippage1.toFixed(1))) * 10);
        const amountOutMin = BigNumber.from(bigOut).mul(temp).div(1000);
        const aggregatorRouter = aggregatorContract(signer);
        const deadlineFromNow = Math.floor(Date.now() / 1000) + deadline * 60;

        try {
          let response;
          if (isCro) {
            response = await aggregatorRouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
              amountOutMin,
              finalPath,
              pairs,
              address,
              deadlineFromNow,
              { value: bigUserInput, gasPrice: finalGasPrice }
            );
          } else if (isOutputCro) {
            response = await aggregatorRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
              bigUserInput,
              amountOutMin,
              finalPath,
              pairs,
              address,
              deadlineFromNow,
              { gasPrice: finalGasPrice }
            );
          } else {
            response = await aggregatorRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
              bigUserInput,
              amountOutMin,
              finalPath,
              pairs,
              address,
              deadlineFromNow,
              { gasPrice: finalGasPrice }
            );
          }
          await response.wait();
          notyf.success("Transaction Success");
        } catch (e) {
          notyf.error("Transaction Failed");
          console.error("Can't complete transaction", e);
        }
      } else {
        notyf.error("Transaction Failed");
      }
    } else {
      notyf.error("Reload the page and try again");
    }
    setIsDisabled(false);
    handleRefreshClick();
  };

  const onClickToken = (element, num) => {
    if (num === 1) {
      setSelectedToken1(element[1]);
      setSelectedIcon1(<img src={require(`../assets/images/webP/${element[2]}`)} alt="icon" />);
      setTokens((state) => ({
        token1: element[0],
        token2: state.token2,
      }));
      setIsCro(element[1] === "CRO");
    } else {
      setSelectedToken2(element[1]);
      setSelectedIcon2(<img src={require(`../assets/images/webP/${element[2]}`)} alt="icon" />);
      setTokens((state) => ({
        token1: state.token1,
        token2: element[0],
      }));
      setIsOutputCro(element[1] === "CRO");
    }
    setSelectToken1(false);
    setSelectToken2(false);
    setUserInput(0);
  };

  const onClickReverse = () => {
    setIsCro(!isCro);
    setIsOutputCro(!isOutputCro);
    setSelectedToken1(selectedToken2);
    setSelectedToken2(selectedToken1);
    setSelectedIcon1(selectedIcon2);
    setSelectedIcon2(selectedIcon1);
    setTokens((state) => ({
      token1: state.token2,
      token2: state.token1,
    }));
    setUserInput(0);
  };

  const calculateAmountAfterSlippage = () => {
    const slippageFraction = parseFloat(slippage1) / 100;
    return (outPutTokens * (1 - slippageFraction)).toFixed(1);
  };

  const onChangeInput = (event) => {
    setDeadline(event.target.value);
  };

  useEffect(() => {
    const searchToken = async (searchValue, setSearchBarValue, setSearchBarValueList, selectTokenNumber) => {
      if (searchValue.startsWith("0x") || searchValue.startsWith("0X")) {
        if (searchValue.length === tokenMap[0][0].length) {
          const tokenRouter = tokenContract(_provider, searchValue);
          try {
            const name = await tokenRouter.symbol();
            setTokens((state) => {
              if (selectTokenNumber === 1) {
                return { token1: searchValue, token2: state.token2 };
              } else {
                return { token1: state.token1, token2: searchValue };
              }
            });
            for (let i = 0; i < tokenMap.length; i++) {
              if (searchValue === tokenMap[i][0]) {
                if (selectTokenNumber === 1) {
                  setSelectedIcon1(<img src={require(`../assets/images/webP/${tokenMap[i][2]}`)} alt="icon" />);
                } else {
                  setSelectedIcon2(<img src={require(`../assets/images/webP/${tokenMap[i][2]}`)} alt="icon" />);
                }
                break;
              }
              if (i === tokenMap.length - 1) {
                if (selectTokenNumber === 1) {
                  setSelectedIcon1(<img src={require(`../assets/images/webP/question-mark.webp`)} alt="icon" />);
                } else {
                  setSelectedIcon2(<img src={require(`../assets/images/webP/question-mark.webp`)} alt="icon" />);
                }
              }
            }
            if (selectTokenNumber === 1) {
              setSelectedToken1(name);
            } else {
              setSelectedToken2(name);
            }
            setSelectToken1(false);
            setIsCro(selectTokenNumber === 1 ? false : isCro);
            setSelectToken2(false);
            setUserInput(0);
          } catch (e) {
            setSearchBarValue(<div>Address Not found</div>);
          }
        } else {
          setSearchBarValue(<div>Address Not found</div>);
        }
      } else {
        const filteredTokens1 = tokenMap2.filter((item) =>
          item[1].includes(searchValue.toUpperCase())
        );
        const tokenElements1 = filteredTokens1.map((element) => (
          <div
            className="fav-token cursor-pointer"
            key={element[0] + element[1] + selectTokenNumber}
            onClick={() => onClickToken(element, selectTokenNumber)}
          >
            <img
              src={element[2] !== "" ? require(`../assets/images/webP/${element[2]}`) : ethIcon}
              alt="eth-icon"
            />
            <div>{element[1]}</div>
          </div>
        ));
        setSearchBarValue(tokenElements1);

        const filteredTokens2 = tokenMap.filter((item) =>
          item[1].includes(searchValue.toUpperCase())
        );
        const tokenElements2 = filteredTokens2.map((element) => (
          <div
            className="fav-token list_token cursor-pointer"
            key={element[0] + element[1] + selectTokenNumber}
            onClick={() => onClickToken(element, selectTokenNumber)}
          >
            <img
              src={element[2] !== "" ? require(`../assets/images/webP/${element[2]}`) : ethIcon}
              alt="eth-icon"
            />
            <div className="list_name_symbol">
              <div>{element[3]}</div>
              <div>{element[1]}</div>
            </div>
          </div>
        ));
        setSearchBarValueList(tokenElements2);
      }
    };

    searchToken(searchValue1, setSearchBarValue1, setSearchBarValueList1, 1);
  }, [searchValue1]);

  useEffect(() => {
    searchToken(searchValue2, setSearchBarValue2, setSearchBarValueList2, 2);
  }, [searchValue2]);

  return (
    <>
      {!isSetting ? (
        <div className="content-wrapper">
          {!selectToken1 && !selectToken2 ? (
            <div
              className="card1"
              style={{
                alignSelf: expanded ? "flex-start" : "center",
              }}
            >
              <div className="swap-form-header">
                <div className="swap-menu-item">Swap</div>
                <div className="swap-icons">
                  <div className="refresh-icon-div">
                    <img
                      onClick={handleRefreshClick}
                      src={refreshLogo}
                      className={`cursor-pointer refreshIcon ${isRotating ? "rotating" : ""}`}
                      alt="refresh"
                    />
                  </div>
                  <div className="refresh-icon-div">
                    <img
                      src={setting}
                      alt="setting"
                      className="cursor-pointer"
                      onClick={() => setIsSetting(true)}
                    />
                  </div>
                </div>
              </div>
              <div className="token-input-wrapper">
                <div className="token-input">
                  <div className="token-input-row buy-sell-text">You sell</div>
                  <div className="token-input-row">
                    <div
                      onClick={() => {
                        setSelectToken1(true);
                        setSearchValue1("");
                      }}
                      className="select-coin cursor-pointer"
                    >
                      <div className="coin-desc">
                        {selectedIcon1}
                        {selectedToken1}
                      </div>
                      <img
                        src={arrowWStroke}
                        className="arrowIcon"
                        alt="arrow"
                      />
                    </div>
                    <input
                      className="input"
                      type="text"
                      placeholder="0.0"
                      value={userInput === "0" ? "" : userInput}
                      onChange={(event) => {
                        const temp = event.target.value.toString();
                        setUserInput(temp === "" ? "0" : temp);
                      }}
                    />
                  </div>
                  <div className="token-input-row">
                    <div className="coin-name">{selectedToken1}</div>
                    {isDataLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <div className="showBalanceOfToken">
                        Balance = {tokenBalance}
                      </div>
                    )}
                  </div>
                  <div className="amountOptionWrapper">
                    <div onClick={() => setUserInput(tokenBalance / 4)} className="amountOption">25%</div>
                    <div onClick={() => setUserInput(tokenBalance / 2)} className="amountOption">50%</div>
                    <div onClick={() => setUserInput(tokenBalance * 3 / 4)} className="amountOption">75%</div>
                    <div onClick={() => setUserInput(tokenBalance / 1)} className="amountOption">100%</div>
                  </div>
                </div>
                <div className="swapIconDiv">
                  <button className="no-style" onClick={onClickReverse}>
                    <img src={swapIcon} className="swapIcon" alt="swap-icon" />
                  </button>
                </div>
                <div className="token-input2">
                  <div className="token-input-row buy-sell-text">You Buy</div>
                  <div className="token-input-row">
                    <div
                      onClick={() => {
                        setSearchValue2("");
                        setSelectToken2(true);
                      }}
                      className="select-coin cursor-pointer"
                    >
                      <div className="coin-desc">
                        {selectedIcon2}
                        {selectedToken2}
                      </div>
                      <img
                        src={arrowWStroke}
                        className="arrowIcon"
                        alt="arrow"
                      />
                    </div>
                    {isDataLoading ? (
                      <div className="loader translate-x-15"></div>
                    ) : (
                      <input
                        className="input"
                        type="text"
                        readOnly={true}
                        value={outPutTokens}
                      />
                    )}
                  </div>
                  <div className="token-input-row">
                    <div className="coin-name">{selectedToken2}</div>
                  </div>
                </div>
              </div>
              <div className="slippage-display">
                <span className="small-text">Current slippage: {slippage1}%</span>
              </div>
              <div className="token-input">
                <div className="swap-mode-selector">
                  <div
                    className="swap-mode-selector-content"
                    style={{
                      display: expanded ? "none" : "flex",
                      overflow: "hidden",
                    }}
                  >
                    <img src={InfoLogo} alt="info-logo" />
                    {isDataLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <p>
                        1 {selectedToken1} ={" "}
                        {tokens.token1 !== tokens.token2
                          ? convertToken.toFixed(4)
                          : 1}{" "}
                        {selectedToken2}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: expanded ? "flex" : "none",
                      width: "100%",
                    }}
                  >
                    Swap mode
                  </div>
                  <div
                    className="accord"
                    style={{
                      width: expanded ? "100%" : "auto",
                    }}
                  >
                    <div
                      style={{
                        display: expanded ? "none" : "flex",
                        overflow: "hidden",
                      }}
                    >
                      <Lottie1 Class="lighteningLottiec1" />
                    </div>
                    <div
                      onClick={() => setExpanded(!expanded)}
                      className="swap-mode-arrowicon"
                    >
                      <img
                        src={arrowWStroke}
                        style={{
                          transform: expanded ? "scale(-1)" : "scale(1)",
                        }}
                        alt="arrow"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: expanded ? "auto" : 0,
                    overflow: "hidden",
                    transition: "height 0.5s ease-out",
                  }}
                >
                  <div className="modes">
                    <div
                      className="mode-option-notselected"
                      onClick={() => {
                        setFastTxn(true);
                      }}
                      style={{
                        backgroundColor: fastTxn ? "#DFBB00" : "#1D1D23",
                        color: fastTxn ? "#020202" : "white",
                      }}
                    >
                      {!fastTxn ? (
                        <Lottie1 Class="lighteningLottiec2" />
                      ) : (
                        <Lottie1Dark Class="lighteningLottiec2" />
                      )}
                      <span>Lightning = Fast</span>
                    </div>
                    <div
                      className="mode-option-selected"
                      onClick={() => {
                        setFastTxn(false);
                      }}
                      style={{
                        backgroundColor: fastTxn ? "#1D1D23" : "#DFBB00",
                        color: fastTxn ? "white" : "#020202",
                      }}
                    >
                      <LegacyIcon
                        className="leagacy-icon"
                        fill={fastTxn ? "#DFBB00" : "#020202"}
                      />
                      <span>
                        Legacy = <b className="bold">Normal</b>
                      </span>
                    </div>
                  </div>
                  <div className="grid-container">
                    <div className="grid-row">
                      <div>1 {selectedToken1} price</div>
                      <div className="value-desc">
                        <span className="highlighted-token-amount">
                          {tokens.token1 !== tokens.token2
                            ? convertToken.toFixed(5)
                            : 1}{" "}
                          ({selectedToken2})
                        </span>
                      </div>
                    </div>
                    <div className="grid-row">
                      <div>1 {selectedToken2} price</div>
                      <div className="value-desc">
                        <span className="highlighted-token-amount">
                          {tokens.token1 !== tokens.token2
                            ? convertToken
                              ? (1 / convertToken).toFixed(5)
                              : "undefined"
                            : 1}{" "}
                          ({selectedToken1})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="token-input-row">
                <div className="amount-after-slippage">
                  <span className="small-text">Minimum received: {calculateAmountAfterSlippage()}</span>
                </div>
              </div>
              <div className="btn-wrapper">
                {!signer && (
                  <ConnectButton
                    className="dex_connect"
                    chainStatus="none"
                    showBalance={false}
                    accountStatus={"avatar"}
                  />
                )}
                {signer && (
                  <button
                    className="connect-wallet-btn dex_connect"
                    onClick={handleSwap}
                    disabled={isDisabled}
                  >
                    Swap
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card2">
              <div className="select-token-header">
                <div
                  className="backIcon-div"
                  onClick={() => {
                    setSelectToken1(false);
                    setSelectToken2(false);
                  }}
                >
                  <img
                    src={arrowWStroke}
                    className="arrowIconback"
                    alt="arrow"
                  />
                </div>
                <div className="headingtxt">Select a token</div>
              </div>
              {selectToken1 && (
                <>
                  <div className="searchBar">
                    <img src={searchIcon} className="searchIcon" alt="search-icon" />
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search by name or paste address"
                      value={searchValue1}
                      onChange={(event) => setSearchValue1(event.target.value)}
                    />
                  </div>
                  <div className="token-grid">{searchBarValue1}</div>
                  <hr />
                  <div className="list">
                    <ul className="list_tokens">{searchBarValueList1}</ul>
                  </div>
                </>
              )}
              {selectToken2 && (
                <>
                  <div className="searchBar">
                    <img src={searchIcon} className="searchIcon" alt="search-icon" />
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search by name or paste address"
                      value={searchValue2}
                      onChange={(event) => setSearchValue2(event.target.value)}
                    />
                  </div>
                  <div className="token-grid">{searchBarValue2}</div>
                  <hr />
                  <div className="list">
                    <ul className="list_tokens">{searchBarValueList2}</ul>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="img-wrapper">
            <img className="lionImage" src={lionImage} alt="lionImage" />
          </div>
        </div>
      ) : (
        <div className="setting-component">
          <div className="setting-wrapper">
            <button
              className="back-button no-style"
              onClick={() => setIsSetting(false)}
            >
              <img src={backBtn} alt="back" />
            </button>
            <div className="setting-container">
              <h1>Slippage tolerance</h1>
              <ul className="slippage">
                {[0.1, 0.5, 1.0].map((value, index) => (
                  <li
                    key={index}
                    className="slippage-item flex-center"
                    style={{
                      backgroundColor: slippage === index + 1 ? "rgba(223, 187, 0, 1)" : "rgba(37, 37, 45, 1)",
                      color: slippage !== index + 1 ? "rgba(153, 153, 153, 1)" : "rgba(23, 24, 29, 1)",
                    }}
                  >
                    <button
                      className="no-style"
                      onClick={() => {
                        setSlippage(index + 1);
                        setSlippage1(value);
                      }}
                    >
                      {value}%
                    </button>
                  </li>
                ))}
                <li className="slippage-item">
                  <input
                    className="setting-input"
                    type="text"
                    value={slippage1}
                    onChange={(event) => {
                      const value = parseFloat(event.target.value);
                      setSlippage1(value);
                      setSlippage([0.1, 0.5, 1.0].includes(value) ? [0.1, 0.5, 1.0].indexOf(value) + 1 : 4);
                    }}
                  />
                </li>
              </ul>
              <div className="tx-deadline">
                <h1>Tx deadline (mins)</h1>
                <input
                  className="setting-input"
                  type="text"
                  value={deadline}
                  onChange={onChangeInput}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
