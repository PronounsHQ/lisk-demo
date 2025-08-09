/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { X, Plus, Coins } from 'lucide-react';
import { useWallets, useLogin, usePrivy } from "@privy-io/react-auth";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants";
import deployToken from "../lib/deployToken";

interface Token {
  _id: string;
  tokenName: string;
  creator: string;
  token: string;
}

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [username, setUsername] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [deploying, setDeploy] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  let usernameFound: string | null = null;

  const { authenticated, ready } = usePrivy(); 

  useEffect(() => {
    (async () => {
      if (ready && authenticated) {
        setLoggedIn(true);
      }
      const { data } = await axios.get(`${BACKEND_URL}`);
      setTokens(data.tokens);

      usernameFound = localStorage.getItem("username");
    })()
  });

  const { login } = useLogin({
    onComplete: () => {
      setLoggedIn(true);
      toast.success("Logged in")
    }
  })

  const { wallets } = useWallets();
  
  const handleDeploy = async () => {
    try {
      setDeploy(true)
      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();

      const token = await deployToken(provider, tokenName, symbol);
      
      if (usernameFound) {
        await axios.post(`${BACKEND_URL}/save-info`, { token });

        toast.success("Token created");
        setDeploy(false);
        setIsModalOpen(false);
        return;
      }

      localStorage.setItem("username", username);
      await axios.post(`${BACKEND_URL}/save-info`, { token, name: username });

      toast.success("Token created");
      setDeploy(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error creating token!");
      setDeploy(false)
    }
  };

  const truncateAddress = (address: string, start: number = 6, end: number = 4) => {
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500 rounded-xl shadow-lg">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Token Manager</h1>
              <p className="text-gray-600 mt-1">Deploy and manage your tokens</p>
            </div>
          </div>

          <button
            onClick={loggedIn ? () => setIsModalOpen(true) : login}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            {loggedIn ? (
              <>
                <Plus className="w-5 h-5" />
                Deploy Token
            </>
          ): "Login"}
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-500 to-blue-500">
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Token Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider hidden sm:table-cell">
                    Token Address
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Creator
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tokens.map((token, index) => (
                  <tr key={token._id} className="hover:bg-sky-50 transition-colors duration-200">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 bg-sky-100 rounded-full">
                        <span className="text-sm font-semibold text-sky-600">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {token.tokenName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{token.tokenName}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <code className="text-sm font-mono text-gray-600">
                          {truncateAddress(token.token)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <code className="text-sm font-mono text-gray-600">
                          {token.creator}
                        </code>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {tokens.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-10 h-10 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tokens deployed yet</h3>
              <p className="text-gray-500 mb-6">Deploy your first token to get started</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
              >
                Deploy Your First Token
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Deploy New Token</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {usernameFound && (
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                  />
                </div>
              )}

              <div>
                <label htmlFor="tokenName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Token Name
                </label>
                <input
                  id="tokenName"
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="Enter token name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="symbol" className="block text-sm font-semibold text-gray-700 mb-2">
                  Token Symbol
                </label>
                <input
                  id="symbol"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter token symbol"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={!tokenName.trim() || !symbol.trim()}
                className="flex-1 px-6 py-3 items-center justify-center bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {deploying ? (
                  <>
                    <ClipLoader size={20} color="white" />
                    <span className="ml-2">Deploying...</span>
                  </>
                ): "Deploy Token"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;