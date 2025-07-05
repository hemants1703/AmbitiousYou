create table "public"."ambitions" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionName" character varying not null,
    "ambitionDefinition" character varying,
    "ambitionTrackingMethod" text not null default 'task'::text,
    "ambitionSuccessMetric" character varying not null,
    "ambitionStartDate" character varying,
    "ambitionEndDate" character varying,
    "ambitionCompletionDate" character varying,
    "ambitionDeadline" character varying not null,
    "ambitionStatus" character varying not null,
    "ambitionPriority" character varying not null,
    "ambitionCategory" character varying not null,
    "ambitionPercentageCompleted" double precision not null,
    "ambitionColor" character varying not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "isFavourited" boolean default false
);


create table "public"."milestones" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionId" uuid not null,
    "milestone" character varying not null,
    "milestoneDescription" character varying,
    "milestoneCompleted" boolean not null default false,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "milestoneTargetDate" timestamp with time zone not null
);


create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionId" uuid not null,
    "note" character varying not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);


create table "public"."plans" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "planName" character varying not null,
    "planMonthlyPrice" double precision not null,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "firstName" character varying not null,
    "lastName" character varying not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null
);


create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "ambitionId" uuid not null,
    "task" character varying not null,
    "taskDescription" character varying,
    "taskCompleted" boolean not null,
    "taskDeadline" character varying not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);


CREATE UNIQUE INDEX ambitions_pkey ON public.ambitions USING btree (id);

CREATE UNIQUE INDEX milestones_pkey ON public.milestones USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

CREATE UNIQUE INDEX profile_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profile_user_id_key ON public.profiles USING btree ("userId");

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

alter table "public"."ambitions" add constraint "ambitions_pkey" PRIMARY KEY using index "ambitions_pkey";

alter table "public"."milestones" add constraint "milestones_pkey" PRIMARY KEY using index "milestones_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."profiles" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."ambitions" add constraint "ambitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ambitions" validate constraint "ambitions_userId_fkey";

alter table "public"."milestones" add constraint "milestones_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES ambitions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."milestones" validate constraint "milestones_ambitionId_fkey";

alter table "public"."milestones" add constraint "milestones_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."milestones" validate constraint "milestones_userId_fkey";

alter table "public"."notes" add constraint "notes_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES ambitions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_ambitionId_fkey";

alter table "public"."notes" add constraint "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_userId_fkey";

alter table "public"."plans" add constraint "plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."plans" validate constraint "plans_userId_fkey";

alter table "public"."profiles" add constraint "profile_user_id_key" UNIQUE using index "profile_user_id_key";

alter table "public"."profiles" add constraint "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_userId_fkey";

alter table "public"."tasks" add constraint "tasks_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES ambitions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_ambitionId_fkey";

alter table "public"."tasks" add constraint "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_userId_fkey";

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

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

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

create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);



