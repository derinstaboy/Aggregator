import { BigNumber } from "ethers";
import { tokenContract, WCroContract } from "./helperConstants";
import value from "../value.json";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

// Helper function to create a notification instance
function createNotyf() {
  return new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    dismissible: true,
  });
}

// Function to find all subsets of an array
export function findSubsets(nums) {
  const result = [];
  const subset = [];
  
  function backtrack(index) {
    if (index === nums.length) {
      result.push([...subset]);
      return;
    }
    backtrack(index + 1);
    subset.push(nums[index]);
    backtrack(index + 1);
    subset.pop();
  }

  backtrack(0);
  return result;
}

// Function to generate all permutations of an array
export function permute(letters) {
  const result = [];
  const used = Array(letters.length).fill(false);
  
  function dfs(path) {
    if (path.length === letters.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      if (used[i]) continue;
      path.push(letters[i]);
      used[i] = true;
      dfs(path);
      path.pop();
      used[i] = false;
    }
  }

  dfs([]);
  return result;
}

// Function to find the maximum value in a 2D array
export function findMax(arr) {
  let maxVal = BigNumber.from("0");
  let maxRow = 0;
  let maxCol = 0;
  const n = arr.length;
  const m = arr[0].length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const value = BigNumber.from(arr[i][j]);
      if (value.gt(maxVal)) {
        maxVal = value;
        maxRow = i;
        maxCol = j;
      }
    }
  }
  return [maxVal, maxRow, maxCol];
}

// Function to check and approve token allowance
async function approveToken(tokenRouter, userAddress, userInput, notyf) {
  const allowance = await tokenRouter.allowance(userAddress, value.aggregatorAddress);
  if (BigNumber.from(allowance._hex).lt(userInput)) {
    notyf.error("Please Approve CROKING DEX to use your token");
    const tx = await tokenRouter.approve(value.aggregatorAddress, BigNumber.from(10).pow(30));
    await tx.wait();
    notyf.success("Approved! Wait few seconds for the transaction to complete");
  }
}

export async function checkAllowance(token, userAddress, signer, userInput) {
  const notyf = createNotyf();
  const tokenRouter = tokenContract(signer, token);
  await approveToken(tokenRouter, userAddress, userInput, notyf);
}

export async function checkAllowanceForWithdrawal(token, userAddress, signer, userInput) {
  const notyf = createNotyf();
  const wCroRouter = WCroContract(signer, token);
  await approveToken(wCroRouter, userAddress, userInput, notyf);
}
