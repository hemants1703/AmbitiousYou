create table "public"."ambitions" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionName" text not null,
    "ambitionDefinition" text,
    "ambitionTrackingMethod" text not null,
    "ambitionStartDate" date not null,
    "ambitionEndDate" date not null,
    "ambitionCompletionDate" date not null,
    "ambitionStatus" text not null,
    "ambitionPriority" text not null,
    "ambitionPercentageCompleted" numeric not null,
    "ambitionColor" text not null,
    "isFavourited" boolean not null default false,
    "createdAt" date not null,
    "updatedAt" date not null
);


create table "public"."milestones" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionId" uuid not null,
    "milestone" text not null,
    "milestoneDescription" text,
    "milestoneCompleted" boolean not null default false,
    "milestoneTargetDate" date not null,
    "createdAt" date not null,
    "updatedAt" date not null
);


create table "public"."plans" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "planName" text not null,
    "planMonthlyPrice" numeric not null,
    "planYearlyPrice" numeric not null,
    "planPeriod" text not null,
    "planStatus" text not null,
    "createdAt" date not null,
    "updatedAt" date not null
);


create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "firstName" text not null,
    "lastName" text not null,
    "createdAt" date not null,
    "updatedAt" date not null
);


create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionId" uuid not null,
    "task" text not null,
    "taskDescription" text,
    "taskCompleted" boolean not null default false,
    "taskDeadline" date not null,
    "createdAt" date not null,
    "updatedAt" date not null
);


CREATE UNIQUE INDEX milestones_pkey ON public.milestones USING btree (id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

CREATE UNIQUE INDEX profile_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.ambitions USING btree (id);

CREATE UNIQUE INDEX tasks_pkey1 ON public.tasks USING btree (id);

alter table "public"."ambitions" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."milestones" add constraint "milestones_pkey" PRIMARY KEY using index "milestones_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."profiles" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."tasks" add constraint "tasks_pkey1" PRIMARY KEY using index "tasks_pkey1";

alter table "public"."ambitions" add constraint "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ambitions" validate constraint "tasks_userId_fkey";

alter table "public"."milestones" add constraint "milestones_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES ambitions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."milestones" validate constraint "milestones_ambitionId_fkey";

alter table "public"."milestones" add constraint "milestones_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."milestones" validate constraint "milestones_userId_fkey";

alter table "public"."plans" add constraint "plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."plans" validate constraint "plans_userId_fkey";

alter table "public"."profiles" add constraint "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profile_userId_fkey";

alter table "public"."tasks" add constraint "tasks_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES ambitions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_ambitionId_fkey";

alter table "public"."tasks" add constraint "tasks_userId_fkey1" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_userId_fkey1";

grant delete on table "public"."ambitions" to "anon";

grant insert on table "public"."ambitions" to "anon";

grant references on table "public"."ambitions" to "anon";

grant select on table "public"."ambitions" to "anon";

grant trigger on table "public"."ambitions" to "anon";

grant truncate on table "public"."ambitions" to "anon";

grant update on table "public"."ambitions" to "anon";

grant delete on table "public"."ambitions" to "authenticated";

grant insert on table "public"."ambitions" to "authenticated";

grant references on table "public"."ambitions" to "authenticated";

grant select on table "public"."ambitions" to "authenticated";

grant trigger on table "public"."ambitions" to "authenticated";

grant truncate on table "public"."ambitions" to "authenticated";

grant update on table "public"."ambitions" to "authenticated";

grant delete on table "public"."ambitions" to "service_role";

grant insert on table "public"."ambitions" to "service_role";

grant references on table "public"."ambitions" to "service_role";

grant select on table "public"."ambitions" to "service_role";

grant trigger on table "public"."ambitions" to "service_role";

grant truncate on table "public"."ambitions" to "service_role";

grant update on table "public"."ambitions" to "service_role";

grant delete on table "public"."milestones" to "anon";

grant insert on table "public"."milestones" to "anon";

grant references on table "public"."milestones" to "anon";

grant select on table "public"."milestones" to "anon";

grant trigger on table "public"."milestones" to "anon";

grant truncate on table "public"."milestones" to "anon";

grant update on table "public"."milestones" to "anon";

grant delete on table "public"."milestones" to "authenticated";

grant insert on table "public"."milestones" to "authenticated";

grant references on table "public"."milestones" to "authenticated";

grant select on table "public"."milestones" to "authenticated";

grant trigger on table "public"."milestones" to "authenticated";

grant truncate on table "public"."milestones" to "authenticated";

grant update on table "public"."milestones" to "authenticated";

grant delete on table "public"."milestones" to "service_role";

grant insert on table "public"."milestones" to "service_role";

grant references on table "public"."milestones" to "service_role";

grant select on table "public"."milestones" to "service_role";

grant trigger on table "public"."milestones" to "service_role";

grant truncate on table "public"."milestones" to "service_role";

grant update on table "public"."milestones" to "service_role";

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";


