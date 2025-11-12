-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 12. 22:48
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
  `type` enum('kiadás','bevétel') NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `transactions`
--

INSERT INTO `transactions` (`ID`, `walletID`, `amount`, `categoryID`, `type`, `date`) VALUES
(1, 1, 66025, 1, 'kiadás', '2025-10-20 00:43:28'),
(2, 2, 60277, 7, 'kiadás', '2025-11-05 00:00:31'),
(3, 2, 71557, 3, 'bevétel', '2025-11-09 18:23:18'),
(4, 2, 88248, 3, 'bevétel', '2025-09-16 02:47:16'),
(5, 2, 51668, 4, 'kiadás', '2025-10-21 20:45:17'),
(6, 2, 93755, 2, 'kiadás', '2025-11-10 23:45:14'),
(7, 2, 27049, 4, 'bevétel', '2025-10-16 11:50:59'),
(8, 1, 75821, 8, 'bevétel', '2025-11-05 23:41:06'),
(9, 2, 68092, 2, 'bevétel', '2025-09-04 01:53:52'),
(10, 1, 78824, 6, 'kiadás', '2025-10-25 03:53:52'),
(11, 1, 73723, 5, 'bevétel', '2025-09-08 17:55:13'),
(13, 1, 67677, 6, 'kiadás', '2025-10-11 16:41:23'),
(14, 2, 37826, 9, 'kiadás', '2025-10-06 23:40:46'),
(15, 2, 95061, 4, 'kiadás', '2025-10-31 04:12:10'),
(16, 1, 72196, 10, 'bevétel', '2025-09-28 03:34:56'),
(17, 1, 31617, 9, 'kiadás', '2025-10-14 19:14:49'),
(18, 2, 19212, 9, 'kiadás', '2025-10-20 15:12:55'),
(19, 1, 9118, 2, 'kiadás', '2025-09-16 23:15:42'),
(20, 1, 84348, 4, 'bevétel', '2025-09-06 23:46:59'),
(21, 1, 27215, 4, 'kiadás', '2025-09-06 09:38:53'),
(22, 1, 20117, 5, 'bevétel', '2025-09-17 21:40:53'),
(23, 2, 23636, 10, 'kiadás', '2025-09-21 19:16:14'),
(24, 1, 78170, 5, 'kiadás', '2025-10-01 03:41:39'),
(25, 1, 27122, 7, 'bevétel', '2025-10-27 22:36:01'),
(26, 2, 75969, 6, 'bevétel', '2025-10-13 05:26:31'),
(27, 2, 91223, 3, 'bevétel', '2025-11-03 09:49:45'),
(28, 1, 3436, 5, 'bevétel', '2025-09-23 16:46:57'),
(29, 1, 75655, 4, 'bevétel', '2025-10-08 18:55:38'),
(30, 2, 53010, 5, 'kiadás', '2025-09-14 03:44:40');

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `transactions`
--
ALTER TABLE `transactions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

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
