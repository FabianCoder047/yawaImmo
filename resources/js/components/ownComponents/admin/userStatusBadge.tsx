type StatusColor = 'purple' | 'green' | 'gray';

interface UserStatusBadgeProps {
  label: string;
  color: StatusColor;
}

const UserStatusBadge = ({ label, color }: UserStatusBadgeProps) => {
  const colors: Record<StatusColor, string> = {
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${colors[color]}`}>
      {label}
    </span>
  );
};

export default UserStatusBadge;
  