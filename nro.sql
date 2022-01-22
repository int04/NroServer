-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 22, 2022 lúc 04:30 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nro`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `3cay_data`
--

CREATE TABLE `3cay_data` (
  `id` int(11) NOT NULL,
  `room` int(11) NOT NULL,
  `cuoc` bigint(50) NOT NULL,
  `win` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `player1` int(11) NOT NULL,
  `player2` int(11) NOT NULL,
  `value1` text NOT NULL DEFAULT '0,0,0',
  `value2` text NOT NULL DEFAULT '0,0,0',
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `3cay_data`
--

INSERT INTO `3cay_data` (`id`, `room`, `cuoc`, `win`, `thoigian`, `player1`, `player2`, `value1`, `value2`, `date`) VALUES
(1, 4, 0, 0, 0, 0, 0, '0,0,0', '0,0,0', '2022-01-22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `3cay_room`
--

CREATE TABLE `3cay_room` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `player1` int(11) NOT NULL,
  `name_1` text NOT NULL,
  `player2` int(11) NOT NULL,
  `name_2` text NOT NULL,
  `value_1` text NOT NULL DEFAULT '0,0,0',
  `evalue_1` text NOT NULL DEFAULT '0,0,0',
  `value_2` text NOT NULL DEFAULT '0,0,0',
  `evalue_2` text NOT NULL DEFAULT '0,0,0',
  `time` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `cuoc` bigint(11) NOT NULL,
  `isrun` int(1) NOT NULL,
  `timecho` int(2) NOT NULL,
  `data` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `3cay_users`
--

CREATE TABLE `3cay_users` (
  `id` int(11) NOT NULL,
  `room` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `name` text NOT NULL,
  `avatar` text NOT NULL,
  `type` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `acc`
--

CREATE TABLE `acc` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `name` text NOT NULL,
  `khu` int(11) NOT NULL,
  `type` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi`
--

CREATE TABLE `banghoi` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `uid` int(11) NOT NULL,
  `MAX` int(11) NOT NULL,
  `time` bigint(50) NOT NULL,
  `xu` bigint(50) NOT NULL,
  `MIN` int(11) NOT NULL,
  `icon` int(11) NOT NULL,
  `khauhieu` text NOT NULL,
  `level` int(11) NOT NULL,
  `exp` bigint(50) NOT NULL,
  `top` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `banghoi`
--

INSERT INTO `banghoi` (`id`, `name`, `uid`, `MAX`, `time`, `xu`, `MIN`, `icon`, `khauhieu`, `level`, `exp`, `top`) VALUES
(1, 'fdfgsdfg', 1, 20, 1642865032777, 0, 1, 1, '', 0, 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_chat`
--

CREATE TABLE `banghoi_chat` (
  `id` int(11) NOT NULL,
  `bang` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `noidung` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_data`
--

CREATE TABLE `banghoi_data` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `nhiemvu` int(11) NOT NULL,
  `MIN` bigint(50) NOT NULL,
  `MAX` bigint(50) NOT NULL,
  `type` text NOT NULL,
  `capdo` int(1) NOT NULL,
  `thuong` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_icon`
--

CREATE TABLE `banghoi_icon` (
  `id` int(11) NOT NULL,
  `icon` int(11) NOT NULL,
  `xu` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `banghoi_icon`
--

INSERT INTO `banghoi_icon` (`id`, `icon`, `xu`) VALUES
(1, 1, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_nhiemvu`
--

CREATE TABLE `banghoi_nhiemvu` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `mota` text NOT NULL,
  `value` bigint(50) NOT NULL,
  `type` text NOT NULL,
  `thuong` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_thanhvien`
--

CREATE TABLE `banghoi_thanhvien` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `thanhtich` bigint(50) NOT NULL,
  `quyen` int(1) NOT NULL,
  `bang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `banghoi_thanhvien`
--

INSERT INTO `banghoi_thanhvien` (`id`, `uid`, `thoigian`, `thanhtich`, `quyen`, `bang`) VALUES
(1, 1, 1642865032779, 0, 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banghoi_xin`
--

CREATE TABLE `banghoi_xin` (
  `id` int(11) NOT NULL,
  `bang` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `time` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bot`
--

CREATE TABLE `bot` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `name` text NOT NULL,
  `taixiu` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `noidung` text CHARACTER SET utf8 NOT NULL,
  `thoigian` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `chat`
--

INSERT INTO `chat` (`id`, `uid`, `noidung`, `thoigian`) VALUES
(1, 1, 'ducnghiait', 1642864667101),
(2, 1, 'code by ducnghia', 1642864671942),
(3, 1, 'cvbxvcb', 1642864967816),
(4, 1, 'fghgf', 1642864968471),
(5, 1, 'fghf', 1642864968843),
(6, 1, 'ghgfh', 1642864969248),
(7, 1, 'fghgfhgfh', 1642864969886),
(8, 1, 'Giftcode 15 phút với mức thưởng là 18,318 xu: <code>NAwsCB-GANuA-HbYI-IoLf9-AUzppw</code>.', 1642865035533),
(9, 1, 'cxvbcvb', 1642865038261),
(10, 1, 'cxvb', 1642865038592),
(11, 1, 'xcv', 1642865039115),
(12, 1, 'bxcvbcxvbcxvbxcvb', 1642865040119);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyentien`
--

CREATE TABLE `chuyentien` (
  `id` int(11) NOT NULL,
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  `vang` bigint(50) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `phi` decimal(11,2) NOT NULL,
  `noidung` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `config`
--

CREATE TABLE `config` (
  `id` int(11) NOT NULL,
  `display` text NOT NULL,
  `name` text CHARACTER SET utf8 NOT NULL,
  `value` text NOT NULL,
  `data` text NOT NULL,
  `group` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `config`
--

INSERT INTO `config` (`id`, `display`, `name`, `value`, `data`, `group`) VALUES
(1, 'Server 1', 'nroclubo1', '1', '1', 'nap'),
(2, 'server 2', 'nroclubo2', '2', '1', 'nap'),
(3, 'server 3', '192w0505', '3', '1', 'nap'),
(4, 'server 4', 'nroclubo4', '4', '1', 'nap'),
(5, 'server 5', 'nroclubo5', '5', '1', 'nap'),
(6, 'server 6', 'nroclubo6', '6', '1', 'nap'),
(7, 'server 7', 'nroclubo7', '7', '1', 'nap'),
(8, 'server 8', 'nroclubo8', '8', '1', 'nap'),
(9, 'server 9', 'nroclubo9', '9', '1', 'nap'),
(10, 'Tỉ lệ Nạp ATM', 'Tỉ lệ nạp ATM', 'nap_atm', '6600', 'napatm'),
(11, 'Tài khoản Thẻ siêu rẻ', 'Tài khoản TSR', 'username_thesieure', 'nroclub68', 'napatm'),
(12, 'Mật khẩu thẻ siêu rẻ', 'Mật khẩu Thẻ siêu rẻ', 'password_thesieure', 'mjtsuyin', 'napatm'),
(13, 'Tài khoản MoMo', 'Tài khoản MoMo', 'username_momo', '0965969675', 'napatm'),
(14, 'Mật Khẩu MoMo', 'Mật khẩu Momo', 'password_momo', '012555', 'napatm'),
(15, 'Thẻ Viettel', 'Viettel', 'VTT', '5600', 'thecao'),
(16, 'Thẻ Vinaphone', 'Vinaphone', 'VNP', '5600', 'thecao'),
(17, 'Thẻ Mobifont', 'Mobifone', 'VMS', '5600', 'thecao'),
(18, 'API key', 'API thẻ cào', 'KeyAPI', '68905d69-be36-43d0-9403-65d0ec79edd7', 'thecao'),
(19, 'Callback API', 'Url Website', 'Urlweb', 'http://api.nro.club:2004/api/thecao', 'thecao'),
(20, 'Server 1', 'nroclubp1', '1', '1', 'rut'),
(21, 'server 2', 'nroclubp2', '2', '1', 'rut'),
(22, 'server 3', '100uw1jr', '3', '1', 'rut'),
(23, 'server 4', 'nroclubp4', '4', '1', 'rut'),
(24, 'server 5', 'nroclubp5', '5', '1', 'rut'),
(25, 'server 6', 'nroclubp6', '6', '1', 'rut'),
(26, 'server 7', 'nroclubp7', '7', '1', 'rut'),
(27, 'server 8', 'nroclubp8', '8', '1', 'rut'),
(28, 'server 9', 'nroclubp9', '9', '1', 'rut'),
(29, 'Phí chuyển tiền', 'Phí chuyển tiền', 'chuyentien', '1', 'chuyentien'),
(30, 'Tiền chuyển thấp nhất', 'Min chuyển tiền', 'min_chuyentien', '20000000', 'chuyentien'),
(31, 'Thông báo', 'Thông báo', 'thongbao', '<p><span style=\"color: #ff0000;\"><span style=\"caret-color: #ff0000;\"><strong>Ae vui l&ograve;ng chờ web xử l&yacute; fix bug, rồi sẽ ho&agrave;n lại số dư cho ae</strong></span></span></p>\n<p><strong><span style=\"color: #800080;\">Đăng k&iacute; t&agrave;i khoản nhận ngay 5.000.000 v&agrave;ng</span></strong></p>\n<p><span style=\"color: #008000;\"><strong>N&acirc;ng tỉ lệ cược Con số may mắn l&ecirc;n x1.95</strong></span></p>\n<p>Khuyến m&atilde;i b&aacute;n v&agrave;ng <span style=\"color: #ff0000;\"><strong>x5600</strong></span> Card <strong><span style=\"color: #ff0000;\">x6600</span></strong> V&iacute;</p>\n<p>V&agrave;ng Nạp - R&uacute;t Tỉ Lệ <span style=\"color: #ff0000;\"><strong>1-1</strong></span></p>\n<p>Cần hỗ trợ nhắn tin qua <strong><span style=\"color: #00ccff;\"><a style=\"color: #00ccff;\" href=\"https://www.facebook.com/Nro.Club/\" target=\"_blank\" rel=\"noopener\" data-cke-saved-href=\"https://www.facebook.com/Nro.Club/\">Fanpage NRO.CLUB</a></span></strong></p>\n<p style=\"text-align: center;\"><iframe title=\"YouTube video player\" src=\"//www.youtube.com/embed/9M-8MjjVlqo\" width=\"350\" height=\"255\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe></p>', 'thongbao'),
(33, 'Vàng cược (nhập 0 để tắt)', 'Vàng cược', 'bot_cuoc', '0', 'bot'),
(34, 'Tỉ lệ cược', 'Tỉ lệ % cược', 'tile_cuoc', '20', 'bot'),
(35, 'Tỉ lệ BOT TÀI XỈU', 'Tỉ lệ % cược', 'tile_tx', '20', 'bot'),
(36, 'Xu cược TX (0 tắt)', 'Xu cược', 'bot_tx_cuoc', '0', 'bot');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuoc`
--

CREATE TABLE `cuoc` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `game` text NOT NULL,
  `vangcuoc` bigint(50) NOT NULL,
  `vangnhan` bigint(50) NOT NULL,
  `cuoc` text NOT NULL,
  `phien` int(11) NOT NULL,
  `trangthai` int(1) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` text NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuoc_taixiu`
--

CREATE TABLE `cuoc_taixiu` (
  `id` int(11) NOT NULL,
  `phien` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `cuachon` text NOT NULL,
  `xucuoc` bigint(50) NOT NULL,
  `xuhoantra` bigint(50) NOT NULL,
  `xunhan` bigint(50) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `trangthai` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuoc_vongquay`
--

CREATE TABLE `cuoc_vongquay` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `xu` bigint(50) NOT NULL,
  `phien` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `win` bigint(50) NOT NULL,
  `trangthai` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giftcode`
--

CREATE TABLE `giftcode` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `text` text NOT NULL,
  `value` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `giftcode`
--

INSERT INTO `giftcode` (`id`, `uid`, `text`, `value`) VALUES
(1, 0, 'NAwsCB-GANuA-HbYI-IoLf9-AUzppw', 18318);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ip`
--

CREATE TABLE `ip` (
  `id` int(11) NOT NULL,
  `ip` text NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `ip`
--

INSERT INTO `ip` (`id`, `ip`, `thoigian`, `uid`) VALUES
(1, '345345', 0, 0),
(2, '::TrangYeuNghiaKhong.', 0, 1),
(3, 'TrangYeuNghiaKhong.TrangTranThu.NghiaYeuTrangNhat.;TrangYeuNghiaKhong.TrangThangTu.NghiaYeuBanTrang.;TrangYeuNghiaKhong.;TrangLaNhat.', 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lixi`
--

CREATE TABLE `lixi` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `min` bigint(50) NOT NULL,
  `max` bigint(50) NOT NULL,
  `xu` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lixi_data`
--

CREATE TABLE `lixi_data` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `lixi` int(11) NOT NULL,
  `xu` bigint(50) NOT NULL,
  `thoigian` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `log_giftcode`
--

CREATE TABLE `log_giftcode` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `ma` text NOT NULL,
  `value` bigint(50) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `momo`
--

CREATE TABLE `momo` (
  `id` int(11) NOT NULL,
  `magiaodich` text NOT NULL,
  `vnd` int(11) NOT NULL,
  `vang` bigint(50) NOT NULL,
  `uid` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `napthoi`
--

CREATE TABLE `napthoi` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` text NOT NULL,
  `server` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `thoivang` int(11) NOT NULL,
  `trangthai` int(1) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `napvang`
--

CREATE TABLE `napvang` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `vang_game` int(11) NOT NULL,
  `vang` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoichoi`
--

CREATE TABLE `nguoichoi` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL DEFAULT -1,
  `bang` int(11) NOT NULL,
  `taikhoan` mediumtext CHARACTER SET utf8mb4 NOT NULL,
  `matkhau` text NOT NULL,
  `name` text NOT NULL,
  `thongtin` text NOT NULL,
  `danhhieu` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`danhhieu`)),
  `xu` bigint(50) NOT NULL,
  `admin` bigint(50) NOT NULL,
  `sdt` mediumtext NOT NULL,
  `ban` int(1) NOT NULL,
  `vip` int(1) NOT NULL,
  `nap` bigint(50) NOT NULL,
  `time_online` bigint(50) NOT NULL,
  `mode` int(1) NOT NULL,
  `thang_taixiu` bigint(50) NOT NULL,
  `thua_taixiu` bigint(50) NOT NULL,
  `thang_csmm` bigint(50) NOT NULL,
  `thua_csmm` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `nguoichoi`
--

INSERT INTO `nguoichoi` (`id`, `server`, `bang`, `taikhoan`, `matkhau`, `name`, `thongtin`, `danhhieu`, `xu`, `admin`, `sdt`, `ban`, `vip`, `nap`, `time_online`, `mode`, `thang_taixiu`, `thua_taixiu`, `thang_csmm`, `thua_csmm`) VALUES
(1, 1, 1, 'admin', '$2b$12$K4lbGcNtwl8Exz4Mm5K75OAAs3QLXp1egcC5FXSKE/6AqN1Prvqgm', 'ducn ghia', '{\"avatar\":\"/vendor/avatar/avatar.png\"}', '{}', 4999990, 3, 'KHFREELUON', 0, 0, 0, 3285729927440, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `npcthoi`
--

CREATE TABLE `npcthoi` (
  `id` int(11) NOT NULL,
  `thoivang` int(11) NOT NULL,
  `thoivangruong` int(11) NOT NULL,
  `map` text NOT NULL,
  `khu` int(11) NOT NULL,
  `name` text NOT NULL,
  `server` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `oantuti`
--

CREATE TABLE `oantuti` (
  `id` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `player1` int(11) NOT NULL,
  `player2` int(11) NOT NULL,
  `chose1` text NOT NULL,
  `chose2` text NOT NULL,
  `status` int(11) NOT NULL,
  `win` int(11) NOT NULL,
  `vang` bigint(50) NOT NULL,
  `time` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phien`
--

CREATE TABLE `phien` (
  `id` int(11) NOT NULL,
  `phien` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `time` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `ketqua` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `phien`
--

INSERT INTO `phien` (`id`, `phien`, `server`, `thoigian`, `time`, `status`, `ketqua`) VALUES
(0, 0, 999, 1642863296418, -1138, 1, '14'),
(0, 0, 999, 1642863589670, -1017, 1, '1'),
(0, 0, 999, 1642863999494, -896, 1, '75'),
(0, 0, 999, 1642864532152, -775, 1, '28'),
(0, 0, 999, 1642864655230, -654, 1, '64'),
(0, 0, 999, 1642864778293, -533, 1, '84'),
(0, 0, 999, 1642864901258, -412, 1, '75'),
(0, 0, 999, 1642865024402, -291, 1, '75'),
(0, 0, 999, 1642865147488, -170, 1, '75'),
(0, 0, 999, 1642865270512, -49, 1, '48'),
(0, 0, 999, 1642865393555, 72, 0, '16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phien_taixiu`
--

CREATE TABLE `phien_taixiu` (
  `id` int(11) NOT NULL,
  `phien` int(11) NOT NULL,
  `x1` int(1) NOT NULL,
  `x2` int(1) NOT NULL,
  `x3` int(1) NOT NULL,
  `thoigian` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `phien_taixiu`
--

INSERT INTO `phien_taixiu` (`id`, `phien`, `x1`, `x2`, `x3`, `thoigian`) VALUES
(0, 1, 4, 2, 1, 1642863355844),
(0, 2, 5, 5, 4, 1642863625942),
(0, 3, 3, 3, 2, 1642864009568),
(0, 4, 1, 3, 1, 1642864489448),
(0, 5, 2, 4, 4, 1642864570444),
(0, 6, 3, 2, 6, 1642864651182),
(0, 7, 4, 5, 1, 1642864731897),
(0, 8, 3, 2, 6, 1642864812562),
(0, 9, 5, 6, 5, 1642864893193),
(0, 10, 5, 6, 4, 1642864973879),
(0, 11, 6, 2, 2, 1642865054677),
(0, 12, 2, 1, 1, 1642865135414),
(0, 13, 5, 6, 4, 1642865216045),
(0, 14, 1, 6, 5, 1642865296732),
(0, 15, 2, 3, 1, 1642865377427);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phien_vongquay`
--

CREATE TABLE `phien_vongquay` (
  `id` int(11) NOT NULL,
  `phien` int(11) NOT NULL,
  `xu` bigint(50) NOT NULL,
  `uid` int(11) NOT NULL,
  `min_cuoc` bigint(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phone`
--

CREATE TABLE `phone` (
  `id` int(11) NOT NULL,
  `uid` bigint(50) NOT NULL,
  `phone` mediumtext NOT NULL,
  `thoigian` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rutvang`
--

CREATE TABLE `rutvang` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` text NOT NULL,
  `server` int(11) NOT NULL,
  `vangnhan` int(11) NOT NULL,
  `vangrut` int(11) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `thoigian` bigint(50) NOT NULL,
  `Fish_time` bigint(50) NOT NULL,
  `trangthai` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `server`
--

CREATE TABLE `server` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `card` int(11) NOT NULL,
  `atm` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sms`
--

CREATE TABLE `sms` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `tieude` text CHARACTER SET utf8 NOT NULL,
  `noidung` text CHARACTER SET utf8 NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `doc` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sodu`
--

CREATE TABLE `sodu` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `truoc` bigint(50) NOT NULL,
  `sau` bigint(50) NOT NULL,
  `xu` bigint(50) NOT NULL,
  `thoigian` bigint(50) NOT NULL,
  `noidung` text CHARACTER SET utf8 NOT NULL,
  `nguon` text NOT NULL,
  `key` int(11) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `sodu`
--

INSERT INTO `sodu` (`id`, `uid`, `truoc`, `sau`, `xu`, `thoigian`, `noidung`, `nguon`, `key`, `date`) VALUES
(0, 1, 5000000, 4999990, -10, 1642865032781, 'Tạo bang', '', 0, '2022-01-22');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `3cay_data`
--
ALTER TABLE `3cay_data`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `3cay_room`
--
ALTER TABLE `3cay_room`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `3cay_users`
--
ALTER TABLE `3cay_users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `acc`
--
ALTER TABLE `acc`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi`
--
ALTER TABLE `banghoi`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_chat`
--
ALTER TABLE `banghoi_chat`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_data`
--
ALTER TABLE `banghoi_data`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_icon`
--
ALTER TABLE `banghoi_icon`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_nhiemvu`
--
ALTER TABLE `banghoi_nhiemvu`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_thanhvien`
--
ALTER TABLE `banghoi_thanhvien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `banghoi_xin`
--
ALTER TABLE `banghoi_xin`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `bot`
--
ALTER TABLE `bot`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chuyentien`
--
ALTER TABLE `chuyentien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cuoc`
--
ALTER TABLE `cuoc`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cuoc_taixiu`
--
ALTER TABLE `cuoc_taixiu`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cuoc_vongquay`
--
ALTER TABLE `cuoc_vongquay`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `giftcode`
--
ALTER TABLE `giftcode`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ip`
--
ALTER TABLE `ip`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `lixi`
--
ALTER TABLE `lixi`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `lixi_data`
--
ALTER TABLE `lixi_data`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `log_giftcode`
--
ALTER TABLE `log_giftcode`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `momo`
--
ALTER TABLE `momo`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `napthoi`
--
ALTER TABLE `napthoi`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `napvang`
--
ALTER TABLE `napvang`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoichoi`
--
ALTER TABLE `nguoichoi`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `npcthoi`
--
ALTER TABLE `npcthoi`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `oantuti`
--
ALTER TABLE `oantuti`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phien_vongquay`
--
ALTER TABLE `phien_vongquay`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phone`
--
ALTER TABLE `phone`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rutvang`
--
ALTER TABLE `rutvang`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sms`
--
ALTER TABLE `sms`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `3cay_data`
--
ALTER TABLE `3cay_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `3cay_room`
--
ALTER TABLE `3cay_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `3cay_users`
--
ALTER TABLE `3cay_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `acc`
--
ALTER TABLE `acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banghoi`
--
ALTER TABLE `banghoi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `banghoi_chat`
--
ALTER TABLE `banghoi_chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banghoi_data`
--
ALTER TABLE `banghoi_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banghoi_icon`
--
ALTER TABLE `banghoi_icon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `banghoi_nhiemvu`
--
ALTER TABLE `banghoi_nhiemvu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banghoi_thanhvien`
--
ALTER TABLE `banghoi_thanhvien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `banghoi_xin`
--
ALTER TABLE `banghoi_xin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bot`
--
ALTER TABLE `bot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `chuyentien`
--
ALTER TABLE `chuyentien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `cuoc`
--
ALTER TABLE `cuoc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cuoc_taixiu`
--
ALTER TABLE `cuoc_taixiu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cuoc_vongquay`
--
ALTER TABLE `cuoc_vongquay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giftcode`
--
ALTER TABLE `giftcode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `ip`
--
ALTER TABLE `ip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `lixi`
--
ALTER TABLE `lixi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lixi_data`
--
ALTER TABLE `lixi_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `log_giftcode`
--
ALTER TABLE `log_giftcode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `momo`
--
ALTER TABLE `momo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `napthoi`
--
ALTER TABLE `napthoi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `napvang`
--
ALTER TABLE `napvang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoichoi`
--
ALTER TABLE `nguoichoi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `npcthoi`
--
ALTER TABLE `npcthoi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `oantuti`
--
ALTER TABLE `oantuti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phien_vongquay`
--
ALTER TABLE `phien_vongquay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phone`
--
ALTER TABLE `phone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rutvang`
--
ALTER TABLE `rutvang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `server`
--
ALTER TABLE `server`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `sms`
--
ALTER TABLE `sms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
