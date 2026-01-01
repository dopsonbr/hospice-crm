import { getActivities } from '@/lib/actions/activities';
import { ACTIVITY_TYPES, OUTCOMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Phone,
  Mail,
  Users,
  Monitor,
  RefreshCw,
  MoreHorizontal,
  Building2,
  User,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  demo: <Monitor className="h-4 w-4" />,
  follow_up: <RefreshCw className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

const outcomeColors: Record<string, 'success' | 'secondary' | 'destructive'> = {
  positive: 'success',
  neutral: 'secondary',
  negative: 'destructive',
};

export default async function ActivitiesPage() {
  const activities = await getActivities();

  // Group activities by date
  const groupedActivities = activities.reduce(
    (groups, activity) => {
      const date = new Date(activity.occurredAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    },
    {} as Record<string, typeof activities>
  );

  const sortedDates = Object.keys(groupedActivities).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const now = new Date();
  const todayStr = now.toLocaleDateString();
  const yesterdayStr = new Date(now.getTime() - 86400000).toLocaleDateString();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Activities</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Log and track all your sales touchpoints
          </p>
        </div>
        <Link href="/activities/new" className="self-start sm:self-auto">
          <Button size="sm" className="sm:size-default">
            <Plus className="h-4 w-4" />
            Log Activity
          </Button>
        </Link>
      </div>

      {activities.length === 0 ? (
        <Card className="p-8 text-center sm:p-12">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No activities yet</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Start logging your sales activities to build a complete history.
          </p>
          <Link href="/activities/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 sm:mb-3 sm:text-sm">
                {date === todayStr ? 'Today' : date === yesterdayStr ? 'Yesterday' : date}
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {groupedActivities[date].map((activity) => {
                  const activityType = ACTIVITY_TYPES.find((t) => t.value === activity.type);
                  const outcome = OUTCOMES.find((o) => o.value === activity.outcome);

                  return (
                    <Card key={activity.id} className="bg-white dark:bg-slate-800">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:h-10 sm:w-10">
                            {typeIcons[activity.type] || <MoreHorizontal className="h-4 w-4" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white sm:text-base">
                                  {activity.subject}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-sm">
                                  <span>{activityType?.label ?? activity.type}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(activity.occurredAt).toLocaleTimeString([], {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {activity.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{activity.duration} min</span>
                                    </>
                                  )}
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-sm">
                                  {activity.facility && (
                                    <span className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      <Link
                                        href={`/facilities/${activity.facility.id}`}
                                        className="hover:text-teal-600 dark:hover:text-teal-400"
                                      >
                                        {activity.facility.name}
                                      </Link>
                                    </span>
                                  )}
                                  {activity.contact && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <Link
                                        href={`/contacts/${activity.contact.id}`}
                                        className="hover:text-teal-600 dark:hover:text-teal-400"
                                      >
                                        {activity.contact.name}
                                      </Link>
                                    </span>
                                  )}
                                  {activity.deal && (
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="h-3 w-3" />
                                      <Link
                                        href={`/pipeline/${activity.deal.id}`}
                                        className="hover:text-teal-600 dark:hover:text-teal-400"
                                      >
                                        {activity.deal.name}
                                      </Link>
                                    </span>
                                  )}
                                </div>

                                {activity.notes && (
                                  <p className="mt-2 whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                    {activity.notes}
                                  </p>
                                )}
                              </div>

                              {outcome && (
                                <Badge variant={outcomeColors[outcome.value]} className="shrink-0 text-xs">
                                  {outcome.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
