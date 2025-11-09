-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 09. 22:07
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `moneymanage`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `ID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`ID`, `name`) VALUES
(1, 'Food - Meal Kits'),
(2, 'Clothing - Activewear'),
(3, 'Home'),
(4, 'Home'),
(5, 'Kitchen'),
(6, 'Fitness'),
(7, 'Food - Deli'),
(8, 'Art Supplies'),
(9, 'Home'),
(10, 'Food - Prepared Foods'),
(11, 'Kitchen'),
(12, 'Garden'),
(13, 'Pets'),
(14, 'Electronics'),
(15, 'Food - Frozen Foods');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `transactions`
--

CREATE TABLE `transactions` (
  `ID` int(11) NOT NULL,
  `walletID` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `type` enum('kiadás','bevétel') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `transactions`
--

INSERT INTO `transactions` (`ID`, `walletID`, `amount`, `categoryID`, `type`) VALUES
(1, 3, 74433, 15, 'kiadás'),
(2, 1, 30000, 2, 'kiadás'),
(3, 3, 8336, 7, 'kiadás'),
(4, 1, 70239, 1, 'bevétel'),
(5, 4, 24584, 10, 'kiadás'),
(6, 3, 20657, 1, 'kiadás'),
(7, 3, 25000, 1, 'kiadás'),
(8, 3, 50000, 3, 'bevétel'),
(9, 4, 10000, 2, 'kiadás'),
(10, 4, 40000, 4, 'bevétel'),
(11, 5, 4000, 2, 'kiadás'),
(12, 1, 66301, 3, 'bevétel'),
(13, 3, 66068, 2, 'bevétel'),
(14, 2, 75246, 2, 'kiadás'),
(15, 3, 58121, 2, 'bevétel'),
(16, 2, 11200, 9, 'kiadás'),
(17, 3, 67202, 1, 'kiadás'),
(18, 5, 27252, 6, 'kiadás'),
(19, 2, 31582, 9, 'kiadás'),
(20, 2, 20896, 3, 'bevétel'),
(21, 3, 12328, 5, 'bevétel'),
(22, 1, 20284, 5, 'bevétel'),
(23, 5, 67663, 2, 'bevétel'),
(24, 2, 38993, 11, 'kiadás'),
(25, 3, 63898, 4, 'bevétel'),
(26, 1, 13657, 14, 'bevétel'),
(27, 1, 70394, 5, 'kiadás'),
(28, 5, 47881, 14, 'kiadás'),
(29, 1, 70454, 12, 'kiadás'),
(30, 3, 60669, 11, 'kiadás'),
(31, 4, 46414, 15, 'kiadás'),
(32, 3, 6301, 11, 'bevétel'),
(33, 1, 70574, 12, 'kiadás'),
(34, 3, 56423, 7, 'bevétel'),
(35, 1, 42344, 11, 'bevétel'),
(36, 1, 21641, 12, 'kiadás'),
(37, 2, 39908, 15, 'kiadás'),
(38, 4, 62377, 14, 'kiadás'),
(39, 3, 59351, 8, 'bevétel'),
(40, 5, 66162, 6, 'kiadás'),
(41, 3, 10362, 15, 'kiadás'),
(42, 1, 72115, 10, 'bevétel'),
(43, 1, 32495, 8, 'bevétel'),
(44, 2, 26040, 12, 'bevétel'),
(45, 2, 35783, 9, 'kiadás'),
(46, 1, 33295, 10, 'bevétel'),
(47, 2, 30378, 15, 'kiadás'),
(48, 4, 46242, 3, 'kiadás'),
(49, 4, 19834, 14, 'bevétel'),
(50, 3, 69367, 2, 'kiadás'),
(51, 4, 14446, 3, 'kiadás'),
(57, 1, 2000, 2, 'kiadás'),
(64, 1, 300000, 14, 'bevétel'),
(65, 5, 666667, 9, 'kiadás');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `role` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `password`, `email`, `status`, `role`) VALUES
(1, 'Csongor', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'czakocsongor@turr.hu', 0, 'user');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `wallets`
--

CREATE TABLE `wallets` (
  `ID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `balance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `wallets`
--

INSERT INTO `wallets` (`ID`, `userID`, `name`, `balance`) VALUES
(1, 1, 'Fő pénztárca', 135000),
(3, 2, 'Bankkártya', 45000),
(4, 3, 'Közös háztartás', 90000),
(5, 1, 'alap', 35000);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `walletID` (`walletID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `userID` (`userID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `transactions`
--
ALTER TABLE `transactions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `wallets`
--
ALTER TABLE `wallets`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
