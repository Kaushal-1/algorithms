
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SubmissionStatus = 'passed' | 'failed' | 'in-progress';

interface CodeSubmissionBadgeProps {
  status: SubmissionStatus;
}

const CodeSubmissionBadge = ({ status }: CodeSubmissionBadgeProps) => {
  let statusConfig = {
    label: "",
    className: ""
  };

  switch (status) {
    case 'passed':
      statusConfig = {
        label: "Passed",
        className: "bg-green-500/20 text-green-500 border-green-500/50"
      };
      break;
    case 'failed':
      statusConfig = {
        label: "Failed",
        className: "bg-red-500/20 text-red-500 border-red-500/50"
      };
      break;
    case 'in-progress':
      statusConfig = {
        label: "In Progress",
        className: "bg-blue-500/20 text-blue-500 border-blue-500/50"
      };
      break;
  }

  return (
    <Badge variant="outline" className={cn("font-medium", statusConfig.className)}>
      {statusConfig.label}
    </Badge>
  );
};

export default CodeSubmissionBadge;
