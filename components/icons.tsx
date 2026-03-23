/**
 * Ícones Phosphor centralizados para o AprovaAí
 * Importe daqui para manter consistência em todo o projeto.
 *
 * Uso em Client Components:
 *   import { IconUser, IconCheck } from "@/components/icons";
 *
 * Uso em Server Components (App Router):
 *   import { UsersIcon } from "@phosphor-icons/react/ssr";
 */

"use client";

export {
  // Navegação & UI
  House as IconHome,
  List as IconMenu,
  X as IconClose,
  MagnifyingGlass as IconSearch,
  Bell as IconBell,
  Gear as IconSettings,
  ArrowLeft as IconBack,
  ArrowRight as IconForward,
  CaretDown as IconChevronDown,
  CaretUp as IconChevronUp,
  CaretRight as IconChevronRight,

  // Usuários & Auth
  User as IconUser,
  Users as IconUsers,
  UserCircle as IconUserCircle,
  SignIn as IconLogin,
  SignOut as IconLogout,
  Lock as IconLock,
  Eye as IconEye,
  EyeSlash as IconEyeSlash,

  // Clientes & Empresa
  Buildings as IconBuilding,
  Briefcase as IconBriefcase,
  IdentificationCard as IconId,

  // Entregáveis & Arquivos
  Package as IconPackage,
  File as IconFile,
  FilePlus as IconFileAdd,
  FileText as IconFileText,
  UploadSimple as IconUpload,
  DownloadSimple as IconDownload,
  Folder as IconFolder,
  Image as IconImage,
  Link as IconLink,

  // Aprovações & Status
  CheckCircle as IconApproved,
  XCircle as IconRejected,
  Clock as IconPending,
  WarningCircle as IconWarning,
  CheckSquare as IconCheck,
  Checks as IconChecks,

  // Calendário & Datas
  Calendar as IconCalendar,
  CalendarPlus as IconCalendarAdd,
  CalendarCheck as IconCalendarCheck,
  Timer as IconTimer,
  CalendarBlank as IconCalendarBlank,

  // Ações
  Plus as IconPlus,
  Minus as IconMinus,
  Pencil as IconEdit,
  Trash as IconDelete,
  Copy as IconCopy,
  Share as IconShare,
  ArrowsClockwise as IconRefresh,
  DotsThreeVertical as IconMoreOptions,

  // Comunicação
  Chat as IconChat,
  ChatText as IconChatText,
  Envelope as IconEmail,
  Phone as IconPhone,

  // Feedback
  CheckFat as IconSuccess,
  Info as IconInfo,
  Question as IconQuestion,

  // Layout
  SquaresFour as IconGrid,
  Rows as IconList,
  SidebarSimple as IconSidebar,

  // Misc
  Lightning as IconLightning,
  Star as IconStar,
  Heart as IconHeart,
  Tag as IconTag,

} from "@phosphor-icons/react";
