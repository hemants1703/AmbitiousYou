
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Ambitions
 * 
 */
export type Ambitions = $Result.DefaultSelection<Prisma.$AmbitionsPayload>
/**
 * Model AmbitionTasks
 * 
 */
export type AmbitionTasks = $Result.DefaultSelection<Prisma.$AmbitionTasksPayload>
/**
 * Model AmbitionMilestones
 * 
 */
export type AmbitionMilestones = $Result.DefaultSelection<Prisma.$AmbitionMilestonesPayload>
/**
 * Model AmbitionNotes
 * 
 */
export type AmbitionNotes = $Result.DefaultSelection<Prisma.$AmbitionNotesPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Priority: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export type Priority = (typeof Priority)[keyof typeof Priority]


export const TrackingMethod: {
  TASKS: 'TASKS',
  MILESTONES: 'MILESTONES'
};

export type TrackingMethod = (typeof TrackingMethod)[keyof typeof TrackingMethod]


export const AmbitionStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
};

export type AmbitionStatus = (typeof AmbitionStatus)[keyof typeof AmbitionStatus]

}

export type Priority = $Enums.Priority

export const Priority: typeof $Enums.Priority

export type TrackingMethod = $Enums.TrackingMethod

export const TrackingMethod: typeof $Enums.TrackingMethod

export type AmbitionStatus = $Enums.AmbitionStatus

export const AmbitionStatus: typeof $Enums.AmbitionStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ambitions`: Exposes CRUD operations for the **Ambitions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ambitions
    * const ambitions = await prisma.ambitions.findMany()
    * ```
    */
  get ambitions(): Prisma.AmbitionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ambitionTasks`: Exposes CRUD operations for the **AmbitionTasks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AmbitionTasks
    * const ambitionTasks = await prisma.ambitionTasks.findMany()
    * ```
    */
  get ambitionTasks(): Prisma.AmbitionTasksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ambitionMilestones`: Exposes CRUD operations for the **AmbitionMilestones** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AmbitionMilestones
    * const ambitionMilestones = await prisma.ambitionMilestones.findMany()
    * ```
    */
  get ambitionMilestones(): Prisma.AmbitionMilestonesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ambitionNotes`: Exposes CRUD operations for the **AmbitionNotes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AmbitionNotes
    * const ambitionNotes = await prisma.ambitionNotes.findMany()
    * ```
    */
  get ambitionNotes(): Prisma.AmbitionNotesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Ambitions: 'Ambitions',
    AmbitionTasks: 'AmbitionTasks',
    AmbitionMilestones: 'AmbitionMilestones',
    AmbitionNotes: 'AmbitionNotes'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "ambitions" | "ambitionTasks" | "ambitionMilestones" | "ambitionNotes"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Ambitions: {
        payload: Prisma.$AmbitionsPayload<ExtArgs>
        fields: Prisma.AmbitionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmbitionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmbitionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          findFirst: {
            args: Prisma.AmbitionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmbitionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          findMany: {
            args: Prisma.AmbitionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>[]
          }
          create: {
            args: Prisma.AmbitionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          createMany: {
            args: Prisma.AmbitionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmbitionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>[]
          }
          delete: {
            args: Prisma.AmbitionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          update: {
            args: Prisma.AmbitionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          deleteMany: {
            args: Prisma.AmbitionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmbitionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmbitionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>[]
          }
          upsert: {
            args: Prisma.AmbitionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionsPayload>
          }
          aggregate: {
            args: Prisma.AmbitionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmbitions>
          }
          groupBy: {
            args: Prisma.AmbitionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmbitionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmbitionsCountArgs<ExtArgs>
            result: $Utils.Optional<AmbitionsCountAggregateOutputType> | number
          }
        }
      }
      AmbitionTasks: {
        payload: Prisma.$AmbitionTasksPayload<ExtArgs>
        fields: Prisma.AmbitionTasksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmbitionTasksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmbitionTasksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          findFirst: {
            args: Prisma.AmbitionTasksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmbitionTasksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          findMany: {
            args: Prisma.AmbitionTasksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>[]
          }
          create: {
            args: Prisma.AmbitionTasksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          createMany: {
            args: Prisma.AmbitionTasksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmbitionTasksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>[]
          }
          delete: {
            args: Prisma.AmbitionTasksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          update: {
            args: Prisma.AmbitionTasksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          deleteMany: {
            args: Prisma.AmbitionTasksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmbitionTasksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmbitionTasksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>[]
          }
          upsert: {
            args: Prisma.AmbitionTasksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionTasksPayload>
          }
          aggregate: {
            args: Prisma.AmbitionTasksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmbitionTasks>
          }
          groupBy: {
            args: Prisma.AmbitionTasksGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmbitionTasksGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmbitionTasksCountArgs<ExtArgs>
            result: $Utils.Optional<AmbitionTasksCountAggregateOutputType> | number
          }
        }
      }
      AmbitionMilestones: {
        payload: Prisma.$AmbitionMilestonesPayload<ExtArgs>
        fields: Prisma.AmbitionMilestonesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmbitionMilestonesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmbitionMilestonesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          findFirst: {
            args: Prisma.AmbitionMilestonesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmbitionMilestonesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          findMany: {
            args: Prisma.AmbitionMilestonesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>[]
          }
          create: {
            args: Prisma.AmbitionMilestonesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          createMany: {
            args: Prisma.AmbitionMilestonesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmbitionMilestonesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>[]
          }
          delete: {
            args: Prisma.AmbitionMilestonesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          update: {
            args: Prisma.AmbitionMilestonesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          deleteMany: {
            args: Prisma.AmbitionMilestonesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmbitionMilestonesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmbitionMilestonesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>[]
          }
          upsert: {
            args: Prisma.AmbitionMilestonesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionMilestonesPayload>
          }
          aggregate: {
            args: Prisma.AmbitionMilestonesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmbitionMilestones>
          }
          groupBy: {
            args: Prisma.AmbitionMilestonesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmbitionMilestonesGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmbitionMilestonesCountArgs<ExtArgs>
            result: $Utils.Optional<AmbitionMilestonesCountAggregateOutputType> | number
          }
        }
      }
      AmbitionNotes: {
        payload: Prisma.$AmbitionNotesPayload<ExtArgs>
        fields: Prisma.AmbitionNotesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmbitionNotesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmbitionNotesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          findFirst: {
            args: Prisma.AmbitionNotesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmbitionNotesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          findMany: {
            args: Prisma.AmbitionNotesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>[]
          }
          create: {
            args: Prisma.AmbitionNotesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          createMany: {
            args: Prisma.AmbitionNotesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmbitionNotesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>[]
          }
          delete: {
            args: Prisma.AmbitionNotesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          update: {
            args: Prisma.AmbitionNotesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          deleteMany: {
            args: Prisma.AmbitionNotesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmbitionNotesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmbitionNotesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>[]
          }
          upsert: {
            args: Prisma.AmbitionNotesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbitionNotesPayload>
          }
          aggregate: {
            args: Prisma.AmbitionNotesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmbitionNotes>
          }
          groupBy: {
            args: Prisma.AmbitionNotesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmbitionNotesGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmbitionNotesCountArgs<ExtArgs>
            result: $Utils.Optional<AmbitionNotesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    ambitions?: AmbitionsOmit
    ambitionTasks?: AmbitionTasksOmit
    ambitionMilestones?: AmbitionMilestonesOmit
    ambitionNotes?: AmbitionNotesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Ambitions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | UserCountOutputTypeCountAmbitionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAmbitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionsWhereInput
  }


  /**
   * Count Type AmbitionsCountOutputType
   */

  export type AmbitionsCountOutputType = {
    tasks: number
    milestones: number
    notes: number
  }

  export type AmbitionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | AmbitionsCountOutputTypeCountTasksArgs
    milestones?: boolean | AmbitionsCountOutputTypeCountMilestonesArgs
    notes?: boolean | AmbitionsCountOutputTypeCountNotesArgs
  }

  // Custom InputTypes
  /**
   * AmbitionsCountOutputType without action
   */
  export type AmbitionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionsCountOutputType
     */
    select?: AmbitionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AmbitionsCountOutputType without action
   */
  export type AmbitionsCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionTasksWhereInput
  }

  /**
   * AmbitionsCountOutputType without action
   */
  export type AmbitionsCountOutputTypeCountMilestonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionMilestonesWhereInput
  }

  /**
   * AmbitionsCountOutputType without action
   */
  export type AmbitionsCountOutputTypeCountNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionNotesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    email: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | User$AmbitionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "email" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | User$AmbitionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      Ambitions: Prisma.$AmbitionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      email: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Ambitions<T extends User$AmbitionsArgs<ExtArgs> = {}>(args?: Subset<T, User$AmbitionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.Ambitions
   */
  export type User$AmbitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    where?: AmbitionsWhereInput
    orderBy?: AmbitionsOrderByWithRelationInput | AmbitionsOrderByWithRelationInput[]
    cursor?: AmbitionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AmbitionsScalarFieldEnum | AmbitionsScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Ambitions
   */

  export type AggregateAmbitions = {
    _count: AmbitionsCountAggregateOutputType | null
    _avg: AmbitionsAvgAggregateOutputType | null
    _sum: AmbitionsSumAggregateOutputType | null
    _min: AmbitionsMinAggregateOutputType | null
    _max: AmbitionsMaxAggregateOutputType | null
  }

  export type AmbitionsAvgAggregateOutputType = {
    timeTrackingDuration: number | null
  }

  export type AmbitionsSumAggregateOutputType = {
    timeTrackingDuration: number | null
  }

  export type AmbitionsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    description: string | null
    category: string | null
    priority: $Enums.Priority | null
    deadline: Date | null
    themeColor: string | null
    trackingMethod: $Enums.TrackingMethod | null
    timeTrackingStart: Date | null
    timeTrackingEnd: Date | null
    timeTrackingDuration: number | null
    timeTrackingUnit: string | null
    timeTrackingStatus: string | null
    status: $Enums.AmbitionStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    description: string | null
    category: string | null
    priority: $Enums.Priority | null
    deadline: Date | null
    themeColor: string | null
    trackingMethod: $Enums.TrackingMethod | null
    timeTrackingStart: Date | null
    timeTrackingEnd: Date | null
    timeTrackingDuration: number | null
    timeTrackingUnit: string | null
    timeTrackingStatus: string | null
    status: $Enums.AmbitionStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionsCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    description: number
    category: number
    priority: number
    deadline: number
    themeColor: number
    trackingMethod: number
    timeTrackingStart: number
    timeTrackingEnd: number
    timeTrackingDuration: number
    timeTrackingUnit: number
    timeTrackingStatus: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmbitionsAvgAggregateInputType = {
    timeTrackingDuration?: true
  }

  export type AmbitionsSumAggregateInputType = {
    timeTrackingDuration?: true
  }

  export type AmbitionsMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    category?: true
    priority?: true
    deadline?: true
    themeColor?: true
    trackingMethod?: true
    timeTrackingStart?: true
    timeTrackingEnd?: true
    timeTrackingDuration?: true
    timeTrackingUnit?: true
    timeTrackingStatus?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionsMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    category?: true
    priority?: true
    deadline?: true
    themeColor?: true
    trackingMethod?: true
    timeTrackingStart?: true
    timeTrackingEnd?: true
    timeTrackingDuration?: true
    timeTrackingUnit?: true
    timeTrackingStatus?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionsCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    category?: true
    priority?: true
    deadline?: true
    themeColor?: true
    trackingMethod?: true
    timeTrackingStart?: true
    timeTrackingEnd?: true
    timeTrackingDuration?: true
    timeTrackingUnit?: true
    timeTrackingStatus?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmbitionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ambitions to aggregate.
     */
    where?: AmbitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambitions to fetch.
     */
    orderBy?: AmbitionsOrderByWithRelationInput | AmbitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmbitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ambitions
    **/
    _count?: true | AmbitionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AmbitionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AmbitionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmbitionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmbitionsMaxAggregateInputType
  }

  export type GetAmbitionsAggregateType<T extends AmbitionsAggregateArgs> = {
        [P in keyof T & keyof AggregateAmbitions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmbitions[P]>
      : GetScalarType<T[P], AggregateAmbitions[P]>
  }




  export type AmbitionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionsWhereInput
    orderBy?: AmbitionsOrderByWithAggregationInput | AmbitionsOrderByWithAggregationInput[]
    by: AmbitionsScalarFieldEnum[] | AmbitionsScalarFieldEnum
    having?: AmbitionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmbitionsCountAggregateInputType | true
    _avg?: AmbitionsAvgAggregateInputType
    _sum?: AmbitionsSumAggregateInputType
    _min?: AmbitionsMinAggregateInputType
    _max?: AmbitionsMaxAggregateInputType
  }

  export type AmbitionsGroupByOutputType = {
    id: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date
    timeTrackingEnd: Date
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt: Date
    updatedAt: Date
    _count: AmbitionsCountAggregateOutputType | null
    _avg: AmbitionsAvgAggregateOutputType | null
    _sum: AmbitionsSumAggregateOutputType | null
    _min: AmbitionsMinAggregateOutputType | null
    _max: AmbitionsMaxAggregateOutputType | null
  }

  type GetAmbitionsGroupByPayload<T extends AmbitionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmbitionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmbitionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmbitionsGroupByOutputType[P]>
            : GetScalarType<T[P], AmbitionsGroupByOutputType[P]>
        }
      >
    >


  export type AmbitionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    priority?: boolean
    deadline?: boolean
    themeColor?: boolean
    trackingMethod?: boolean
    timeTrackingStart?: boolean
    timeTrackingEnd?: boolean
    timeTrackingDuration?: boolean
    timeTrackingUnit?: boolean
    timeTrackingStatus?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Ambitions$tasksArgs<ExtArgs>
    milestones?: boolean | Ambitions$milestonesArgs<ExtArgs>
    notes?: boolean | Ambitions$notesArgs<ExtArgs>
    _count?: boolean | AmbitionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitions"]>

  export type AmbitionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    priority?: boolean
    deadline?: boolean
    themeColor?: boolean
    trackingMethod?: boolean
    timeTrackingStart?: boolean
    timeTrackingEnd?: boolean
    timeTrackingDuration?: boolean
    timeTrackingUnit?: boolean
    timeTrackingStatus?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitions"]>

  export type AmbitionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    priority?: boolean
    deadline?: boolean
    themeColor?: boolean
    trackingMethod?: boolean
    timeTrackingStart?: boolean
    timeTrackingEnd?: boolean
    timeTrackingDuration?: boolean
    timeTrackingUnit?: boolean
    timeTrackingStatus?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitions"]>

  export type AmbitionsSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    priority?: boolean
    deadline?: boolean
    themeColor?: boolean
    trackingMethod?: boolean
    timeTrackingStart?: boolean
    timeTrackingEnd?: boolean
    timeTrackingDuration?: boolean
    timeTrackingUnit?: boolean
    timeTrackingStatus?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmbitionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "description" | "category" | "priority" | "deadline" | "themeColor" | "trackingMethod" | "timeTrackingStart" | "timeTrackingEnd" | "timeTrackingDuration" | "timeTrackingUnit" | "timeTrackingStatus" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["ambitions"]>
  export type AmbitionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Ambitions$tasksArgs<ExtArgs>
    milestones?: boolean | Ambitions$milestonesArgs<ExtArgs>
    notes?: boolean | Ambitions$notesArgs<ExtArgs>
    _count?: boolean | AmbitionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AmbitionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AmbitionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AmbitionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ambitions"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tasks: Prisma.$AmbitionTasksPayload<ExtArgs>[]
      milestones: Prisma.$AmbitionMilestonesPayload<ExtArgs>[]
      notes: Prisma.$AmbitionNotesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      description: string
      category: string
      priority: $Enums.Priority
      deadline: Date
      themeColor: string
      trackingMethod: $Enums.TrackingMethod
      timeTrackingStart: Date
      timeTrackingEnd: Date
      timeTrackingDuration: number
      timeTrackingUnit: string
      timeTrackingStatus: string
      status: $Enums.AmbitionStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ambitions"]>
    composites: {}
  }

  type AmbitionsGetPayload<S extends boolean | null | undefined | AmbitionsDefaultArgs> = $Result.GetResult<Prisma.$AmbitionsPayload, S>

  type AmbitionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmbitionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmbitionsCountAggregateInputType | true
    }

  export interface AmbitionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ambitions'], meta: { name: 'Ambitions' } }
    /**
     * Find zero or one Ambitions that matches the filter.
     * @param {AmbitionsFindUniqueArgs} args - Arguments to find a Ambitions
     * @example
     * // Get one Ambitions
     * const ambitions = await prisma.ambitions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmbitionsFindUniqueArgs>(args: SelectSubset<T, AmbitionsFindUniqueArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ambitions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmbitionsFindUniqueOrThrowArgs} args - Arguments to find a Ambitions
     * @example
     * // Get one Ambitions
     * const ambitions = await prisma.ambitions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmbitionsFindUniqueOrThrowArgs>(args: SelectSubset<T, AmbitionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ambitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsFindFirstArgs} args - Arguments to find a Ambitions
     * @example
     * // Get one Ambitions
     * const ambitions = await prisma.ambitions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmbitionsFindFirstArgs>(args?: SelectSubset<T, AmbitionsFindFirstArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ambitions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsFindFirstOrThrowArgs} args - Arguments to find a Ambitions
     * @example
     * // Get one Ambitions
     * const ambitions = await prisma.ambitions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmbitionsFindFirstOrThrowArgs>(args?: SelectSubset<T, AmbitionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ambitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ambitions
     * const ambitions = await prisma.ambitions.findMany()
     * 
     * // Get first 10 Ambitions
     * const ambitions = await prisma.ambitions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ambitionsWithIdOnly = await prisma.ambitions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmbitionsFindManyArgs>(args?: SelectSubset<T, AmbitionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ambitions.
     * @param {AmbitionsCreateArgs} args - Arguments to create a Ambitions.
     * @example
     * // Create one Ambitions
     * const Ambitions = await prisma.ambitions.create({
     *   data: {
     *     // ... data to create a Ambitions
     *   }
     * })
     * 
     */
    create<T extends AmbitionsCreateArgs>(args: SelectSubset<T, AmbitionsCreateArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ambitions.
     * @param {AmbitionsCreateManyArgs} args - Arguments to create many Ambitions.
     * @example
     * // Create many Ambitions
     * const ambitions = await prisma.ambitions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmbitionsCreateManyArgs>(args?: SelectSubset<T, AmbitionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ambitions and returns the data saved in the database.
     * @param {AmbitionsCreateManyAndReturnArgs} args - Arguments to create many Ambitions.
     * @example
     * // Create many Ambitions
     * const ambitions = await prisma.ambitions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ambitions and only return the `id`
     * const ambitionsWithIdOnly = await prisma.ambitions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmbitionsCreateManyAndReturnArgs>(args?: SelectSubset<T, AmbitionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ambitions.
     * @param {AmbitionsDeleteArgs} args - Arguments to delete one Ambitions.
     * @example
     * // Delete one Ambitions
     * const Ambitions = await prisma.ambitions.delete({
     *   where: {
     *     // ... filter to delete one Ambitions
     *   }
     * })
     * 
     */
    delete<T extends AmbitionsDeleteArgs>(args: SelectSubset<T, AmbitionsDeleteArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ambitions.
     * @param {AmbitionsUpdateArgs} args - Arguments to update one Ambitions.
     * @example
     * // Update one Ambitions
     * const ambitions = await prisma.ambitions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmbitionsUpdateArgs>(args: SelectSubset<T, AmbitionsUpdateArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ambitions.
     * @param {AmbitionsDeleteManyArgs} args - Arguments to filter Ambitions to delete.
     * @example
     * // Delete a few Ambitions
     * const { count } = await prisma.ambitions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmbitionsDeleteManyArgs>(args?: SelectSubset<T, AmbitionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ambitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ambitions
     * const ambitions = await prisma.ambitions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmbitionsUpdateManyArgs>(args: SelectSubset<T, AmbitionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ambitions and returns the data updated in the database.
     * @param {AmbitionsUpdateManyAndReturnArgs} args - Arguments to update many Ambitions.
     * @example
     * // Update many Ambitions
     * const ambitions = await prisma.ambitions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ambitions and only return the `id`
     * const ambitionsWithIdOnly = await prisma.ambitions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmbitionsUpdateManyAndReturnArgs>(args: SelectSubset<T, AmbitionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ambitions.
     * @param {AmbitionsUpsertArgs} args - Arguments to update or create a Ambitions.
     * @example
     * // Update or create a Ambitions
     * const ambitions = await prisma.ambitions.upsert({
     *   create: {
     *     // ... data to create a Ambitions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ambitions we want to update
     *   }
     * })
     */
    upsert<T extends AmbitionsUpsertArgs>(args: SelectSubset<T, AmbitionsUpsertArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ambitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsCountArgs} args - Arguments to filter Ambitions to count.
     * @example
     * // Count the number of Ambitions
     * const count = await prisma.ambitions.count({
     *   where: {
     *     // ... the filter for the Ambitions we want to count
     *   }
     * })
    **/
    count<T extends AmbitionsCountArgs>(
      args?: Subset<T, AmbitionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmbitionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ambitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmbitionsAggregateArgs>(args: Subset<T, AmbitionsAggregateArgs>): Prisma.PrismaPromise<GetAmbitionsAggregateType<T>>

    /**
     * Group by Ambitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmbitionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmbitionsGroupByArgs['orderBy'] }
        : { orderBy?: AmbitionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmbitionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmbitionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ambitions model
   */
  readonly fields: AmbitionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ambitions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmbitionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tasks<T extends Ambitions$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Ambitions$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    milestones<T extends Ambitions$milestonesArgs<ExtArgs> = {}>(args?: Subset<T, Ambitions$milestonesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notes<T extends Ambitions$notesArgs<ExtArgs> = {}>(args?: Subset<T, Ambitions$notesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ambitions model
   */
  interface AmbitionsFieldRefs {
    readonly id: FieldRef<"Ambitions", 'String'>
    readonly userId: FieldRef<"Ambitions", 'String'>
    readonly title: FieldRef<"Ambitions", 'String'>
    readonly description: FieldRef<"Ambitions", 'String'>
    readonly category: FieldRef<"Ambitions", 'String'>
    readonly priority: FieldRef<"Ambitions", 'Priority'>
    readonly deadline: FieldRef<"Ambitions", 'DateTime'>
    readonly themeColor: FieldRef<"Ambitions", 'String'>
    readonly trackingMethod: FieldRef<"Ambitions", 'TrackingMethod'>
    readonly timeTrackingStart: FieldRef<"Ambitions", 'DateTime'>
    readonly timeTrackingEnd: FieldRef<"Ambitions", 'DateTime'>
    readonly timeTrackingDuration: FieldRef<"Ambitions", 'Int'>
    readonly timeTrackingUnit: FieldRef<"Ambitions", 'String'>
    readonly timeTrackingStatus: FieldRef<"Ambitions", 'String'>
    readonly status: FieldRef<"Ambitions", 'AmbitionStatus'>
    readonly createdAt: FieldRef<"Ambitions", 'DateTime'>
    readonly updatedAt: FieldRef<"Ambitions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ambitions findUnique
   */
  export type AmbitionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter, which Ambitions to fetch.
     */
    where: AmbitionsWhereUniqueInput
  }

  /**
   * Ambitions findUniqueOrThrow
   */
  export type AmbitionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter, which Ambitions to fetch.
     */
    where: AmbitionsWhereUniqueInput
  }

  /**
   * Ambitions findFirst
   */
  export type AmbitionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter, which Ambitions to fetch.
     */
    where?: AmbitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambitions to fetch.
     */
    orderBy?: AmbitionsOrderByWithRelationInput | AmbitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ambitions.
     */
    cursor?: AmbitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ambitions.
     */
    distinct?: AmbitionsScalarFieldEnum | AmbitionsScalarFieldEnum[]
  }

  /**
   * Ambitions findFirstOrThrow
   */
  export type AmbitionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter, which Ambitions to fetch.
     */
    where?: AmbitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambitions to fetch.
     */
    orderBy?: AmbitionsOrderByWithRelationInput | AmbitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ambitions.
     */
    cursor?: AmbitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ambitions.
     */
    distinct?: AmbitionsScalarFieldEnum | AmbitionsScalarFieldEnum[]
  }

  /**
   * Ambitions findMany
   */
  export type AmbitionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter, which Ambitions to fetch.
     */
    where?: AmbitionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambitions to fetch.
     */
    orderBy?: AmbitionsOrderByWithRelationInput | AmbitionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ambitions.
     */
    cursor?: AmbitionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambitions.
     */
    skip?: number
    distinct?: AmbitionsScalarFieldEnum | AmbitionsScalarFieldEnum[]
  }

  /**
   * Ambitions create
   */
  export type AmbitionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Ambitions.
     */
    data: XOR<AmbitionsCreateInput, AmbitionsUncheckedCreateInput>
  }

  /**
   * Ambitions createMany
   */
  export type AmbitionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ambitions.
     */
    data: AmbitionsCreateManyInput | AmbitionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ambitions createManyAndReturn
   */
  export type AmbitionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * The data used to create many Ambitions.
     */
    data: AmbitionsCreateManyInput | AmbitionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ambitions update
   */
  export type AmbitionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Ambitions.
     */
    data: XOR<AmbitionsUpdateInput, AmbitionsUncheckedUpdateInput>
    /**
     * Choose, which Ambitions to update.
     */
    where: AmbitionsWhereUniqueInput
  }

  /**
   * Ambitions updateMany
   */
  export type AmbitionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ambitions.
     */
    data: XOR<AmbitionsUpdateManyMutationInput, AmbitionsUncheckedUpdateManyInput>
    /**
     * Filter which Ambitions to update
     */
    where?: AmbitionsWhereInput
    /**
     * Limit how many Ambitions to update.
     */
    limit?: number
  }

  /**
   * Ambitions updateManyAndReturn
   */
  export type AmbitionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * The data used to update Ambitions.
     */
    data: XOR<AmbitionsUpdateManyMutationInput, AmbitionsUncheckedUpdateManyInput>
    /**
     * Filter which Ambitions to update
     */
    where?: AmbitionsWhereInput
    /**
     * Limit how many Ambitions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ambitions upsert
   */
  export type AmbitionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Ambitions to update in case it exists.
     */
    where: AmbitionsWhereUniqueInput
    /**
     * In case the Ambitions found by the `where` argument doesn't exist, create a new Ambitions with this data.
     */
    create: XOR<AmbitionsCreateInput, AmbitionsUncheckedCreateInput>
    /**
     * In case the Ambitions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmbitionsUpdateInput, AmbitionsUncheckedUpdateInput>
  }

  /**
   * Ambitions delete
   */
  export type AmbitionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    /**
     * Filter which Ambitions to delete.
     */
    where: AmbitionsWhereUniqueInput
  }

  /**
   * Ambitions deleteMany
   */
  export type AmbitionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ambitions to delete
     */
    where?: AmbitionsWhereInput
    /**
     * Limit how many Ambitions to delete.
     */
    limit?: number
  }

  /**
   * Ambitions.tasks
   */
  export type Ambitions$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    where?: AmbitionTasksWhereInput
    orderBy?: AmbitionTasksOrderByWithRelationInput | AmbitionTasksOrderByWithRelationInput[]
    cursor?: AmbitionTasksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AmbitionTasksScalarFieldEnum | AmbitionTasksScalarFieldEnum[]
  }

  /**
   * Ambitions.milestones
   */
  export type Ambitions$milestonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    where?: AmbitionMilestonesWhereInput
    orderBy?: AmbitionMilestonesOrderByWithRelationInput | AmbitionMilestonesOrderByWithRelationInput[]
    cursor?: AmbitionMilestonesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AmbitionMilestonesScalarFieldEnum | AmbitionMilestonesScalarFieldEnum[]
  }

  /**
   * Ambitions.notes
   */
  export type Ambitions$notesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    where?: AmbitionNotesWhereInput
    orderBy?: AmbitionNotesOrderByWithRelationInput | AmbitionNotesOrderByWithRelationInput[]
    cursor?: AmbitionNotesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AmbitionNotesScalarFieldEnum | AmbitionNotesScalarFieldEnum[]
  }

  /**
   * Ambitions without action
   */
  export type AmbitionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
  }


  /**
   * Model AmbitionTasks
   */

  export type AggregateAmbitionTasks = {
    _count: AmbitionTasksCountAggregateOutputType | null
    _min: AmbitionTasksMinAggregateOutputType | null
    _max: AmbitionTasksMaxAggregateOutputType | null
  }

  export type AmbitionTasksMinAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    task: string | null
    description: string | null
    completed: boolean | null
    deadline: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionTasksMaxAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    task: string | null
    description: string | null
    completed: boolean | null
    deadline: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionTasksCountAggregateOutputType = {
    id: number
    ambitionId: number
    task: number
    description: number
    completed: number
    deadline: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmbitionTasksMinAggregateInputType = {
    id?: true
    ambitionId?: true
    task?: true
    description?: true
    completed?: true
    deadline?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionTasksMaxAggregateInputType = {
    id?: true
    ambitionId?: true
    task?: true
    description?: true
    completed?: true
    deadline?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionTasksCountAggregateInputType = {
    id?: true
    ambitionId?: true
    task?: true
    description?: true
    completed?: true
    deadline?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmbitionTasksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionTasks to aggregate.
     */
    where?: AmbitionTasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionTasks to fetch.
     */
    orderBy?: AmbitionTasksOrderByWithRelationInput | AmbitionTasksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmbitionTasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AmbitionTasks
    **/
    _count?: true | AmbitionTasksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmbitionTasksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmbitionTasksMaxAggregateInputType
  }

  export type GetAmbitionTasksAggregateType<T extends AmbitionTasksAggregateArgs> = {
        [P in keyof T & keyof AggregateAmbitionTasks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmbitionTasks[P]>
      : GetScalarType<T[P], AggregateAmbitionTasks[P]>
  }




  export type AmbitionTasksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionTasksWhereInput
    orderBy?: AmbitionTasksOrderByWithAggregationInput | AmbitionTasksOrderByWithAggregationInput[]
    by: AmbitionTasksScalarFieldEnum[] | AmbitionTasksScalarFieldEnum
    having?: AmbitionTasksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmbitionTasksCountAggregateInputType | true
    _min?: AmbitionTasksMinAggregateInputType
    _max?: AmbitionTasksMaxAggregateInputType
  }

  export type AmbitionTasksGroupByOutputType = {
    id: string
    ambitionId: string
    task: string
    description: string
    completed: boolean
    deadline: Date
    createdAt: Date
    updatedAt: Date
    _count: AmbitionTasksCountAggregateOutputType | null
    _min: AmbitionTasksMinAggregateOutputType | null
    _max: AmbitionTasksMaxAggregateOutputType | null
  }

  type GetAmbitionTasksGroupByPayload<T extends AmbitionTasksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmbitionTasksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmbitionTasksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmbitionTasksGroupByOutputType[P]>
            : GetScalarType<T[P], AmbitionTasksGroupByOutputType[P]>
        }
      >
    >


  export type AmbitionTasksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    task?: boolean
    description?: boolean
    completed?: boolean
    deadline?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionTasks"]>

  export type AmbitionTasksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    task?: boolean
    description?: boolean
    completed?: boolean
    deadline?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionTasks"]>

  export type AmbitionTasksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    task?: boolean
    description?: boolean
    completed?: boolean
    deadline?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionTasks"]>

  export type AmbitionTasksSelectScalar = {
    id?: boolean
    ambitionId?: boolean
    task?: boolean
    description?: boolean
    completed?: boolean
    deadline?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmbitionTasksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ambitionId" | "task" | "description" | "completed" | "deadline" | "createdAt" | "updatedAt", ExtArgs["result"]["ambitionTasks"]>
  export type AmbitionTasksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }
  export type AmbitionTasksIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }
  export type AmbitionTasksIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ambition?: boolean | AmbitionsDefaultArgs<ExtArgs>
  }

  export type $AmbitionTasksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AmbitionTasks"
    objects: {
      ambition: Prisma.$AmbitionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ambitionId: string
      task: string
      description: string
      completed: boolean
      deadline: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ambitionTasks"]>
    composites: {}
  }

  type AmbitionTasksGetPayload<S extends boolean | null | undefined | AmbitionTasksDefaultArgs> = $Result.GetResult<Prisma.$AmbitionTasksPayload, S>

  type AmbitionTasksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmbitionTasksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmbitionTasksCountAggregateInputType | true
    }

  export interface AmbitionTasksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AmbitionTasks'], meta: { name: 'AmbitionTasks' } }
    /**
     * Find zero or one AmbitionTasks that matches the filter.
     * @param {AmbitionTasksFindUniqueArgs} args - Arguments to find a AmbitionTasks
     * @example
     * // Get one AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmbitionTasksFindUniqueArgs>(args: SelectSubset<T, AmbitionTasksFindUniqueArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AmbitionTasks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmbitionTasksFindUniqueOrThrowArgs} args - Arguments to find a AmbitionTasks
     * @example
     * // Get one AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmbitionTasksFindUniqueOrThrowArgs>(args: SelectSubset<T, AmbitionTasksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksFindFirstArgs} args - Arguments to find a AmbitionTasks
     * @example
     * // Get one AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmbitionTasksFindFirstArgs>(args?: SelectSubset<T, AmbitionTasksFindFirstArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionTasks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksFindFirstOrThrowArgs} args - Arguments to find a AmbitionTasks
     * @example
     * // Get one AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmbitionTasksFindFirstOrThrowArgs>(args?: SelectSubset<T, AmbitionTasksFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AmbitionTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findMany()
     * 
     * // Get first 10 AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ambitionTasksWithIdOnly = await prisma.ambitionTasks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmbitionTasksFindManyArgs>(args?: SelectSubset<T, AmbitionTasksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AmbitionTasks.
     * @param {AmbitionTasksCreateArgs} args - Arguments to create a AmbitionTasks.
     * @example
     * // Create one AmbitionTasks
     * const AmbitionTasks = await prisma.ambitionTasks.create({
     *   data: {
     *     // ... data to create a AmbitionTasks
     *   }
     * })
     * 
     */
    create<T extends AmbitionTasksCreateArgs>(args: SelectSubset<T, AmbitionTasksCreateArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AmbitionTasks.
     * @param {AmbitionTasksCreateManyArgs} args - Arguments to create many AmbitionTasks.
     * @example
     * // Create many AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmbitionTasksCreateManyArgs>(args?: SelectSubset<T, AmbitionTasksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AmbitionTasks and returns the data saved in the database.
     * @param {AmbitionTasksCreateManyAndReturnArgs} args - Arguments to create many AmbitionTasks.
     * @example
     * // Create many AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AmbitionTasks and only return the `id`
     * const ambitionTasksWithIdOnly = await prisma.ambitionTasks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmbitionTasksCreateManyAndReturnArgs>(args?: SelectSubset<T, AmbitionTasksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AmbitionTasks.
     * @param {AmbitionTasksDeleteArgs} args - Arguments to delete one AmbitionTasks.
     * @example
     * // Delete one AmbitionTasks
     * const AmbitionTasks = await prisma.ambitionTasks.delete({
     *   where: {
     *     // ... filter to delete one AmbitionTasks
     *   }
     * })
     * 
     */
    delete<T extends AmbitionTasksDeleteArgs>(args: SelectSubset<T, AmbitionTasksDeleteArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AmbitionTasks.
     * @param {AmbitionTasksUpdateArgs} args - Arguments to update one AmbitionTasks.
     * @example
     * // Update one AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmbitionTasksUpdateArgs>(args: SelectSubset<T, AmbitionTasksUpdateArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AmbitionTasks.
     * @param {AmbitionTasksDeleteManyArgs} args - Arguments to filter AmbitionTasks to delete.
     * @example
     * // Delete a few AmbitionTasks
     * const { count } = await prisma.ambitionTasks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmbitionTasksDeleteManyArgs>(args?: SelectSubset<T, AmbitionTasksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmbitionTasksUpdateManyArgs>(args: SelectSubset<T, AmbitionTasksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionTasks and returns the data updated in the database.
     * @param {AmbitionTasksUpdateManyAndReturnArgs} args - Arguments to update many AmbitionTasks.
     * @example
     * // Update many AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AmbitionTasks and only return the `id`
     * const ambitionTasksWithIdOnly = await prisma.ambitionTasks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmbitionTasksUpdateManyAndReturnArgs>(args: SelectSubset<T, AmbitionTasksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AmbitionTasks.
     * @param {AmbitionTasksUpsertArgs} args - Arguments to update or create a AmbitionTasks.
     * @example
     * // Update or create a AmbitionTasks
     * const ambitionTasks = await prisma.ambitionTasks.upsert({
     *   create: {
     *     // ... data to create a AmbitionTasks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AmbitionTasks we want to update
     *   }
     * })
     */
    upsert<T extends AmbitionTasksUpsertArgs>(args: SelectSubset<T, AmbitionTasksUpsertArgs<ExtArgs>>): Prisma__AmbitionTasksClient<$Result.GetResult<Prisma.$AmbitionTasksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AmbitionTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksCountArgs} args - Arguments to filter AmbitionTasks to count.
     * @example
     * // Count the number of AmbitionTasks
     * const count = await prisma.ambitionTasks.count({
     *   where: {
     *     // ... the filter for the AmbitionTasks we want to count
     *   }
     * })
    **/
    count<T extends AmbitionTasksCountArgs>(
      args?: Subset<T, AmbitionTasksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmbitionTasksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AmbitionTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmbitionTasksAggregateArgs>(args: Subset<T, AmbitionTasksAggregateArgs>): Prisma.PrismaPromise<GetAmbitionTasksAggregateType<T>>

    /**
     * Group by AmbitionTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionTasksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmbitionTasksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmbitionTasksGroupByArgs['orderBy'] }
        : { orderBy?: AmbitionTasksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmbitionTasksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmbitionTasksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AmbitionTasks model
   */
  readonly fields: AmbitionTasksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AmbitionTasks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmbitionTasksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ambition<T extends AmbitionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AmbitionsDefaultArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AmbitionTasks model
   */
  interface AmbitionTasksFieldRefs {
    readonly id: FieldRef<"AmbitionTasks", 'String'>
    readonly ambitionId: FieldRef<"AmbitionTasks", 'String'>
    readonly task: FieldRef<"AmbitionTasks", 'String'>
    readonly description: FieldRef<"AmbitionTasks", 'String'>
    readonly completed: FieldRef<"AmbitionTasks", 'Boolean'>
    readonly deadline: FieldRef<"AmbitionTasks", 'DateTime'>
    readonly createdAt: FieldRef<"AmbitionTasks", 'DateTime'>
    readonly updatedAt: FieldRef<"AmbitionTasks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AmbitionTasks findUnique
   */
  export type AmbitionTasksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionTasks to fetch.
     */
    where: AmbitionTasksWhereUniqueInput
  }

  /**
   * AmbitionTasks findUniqueOrThrow
   */
  export type AmbitionTasksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionTasks to fetch.
     */
    where: AmbitionTasksWhereUniqueInput
  }

  /**
   * AmbitionTasks findFirst
   */
  export type AmbitionTasksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionTasks to fetch.
     */
    where?: AmbitionTasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionTasks to fetch.
     */
    orderBy?: AmbitionTasksOrderByWithRelationInput | AmbitionTasksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionTasks.
     */
    cursor?: AmbitionTasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionTasks.
     */
    distinct?: AmbitionTasksScalarFieldEnum | AmbitionTasksScalarFieldEnum[]
  }

  /**
   * AmbitionTasks findFirstOrThrow
   */
  export type AmbitionTasksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionTasks to fetch.
     */
    where?: AmbitionTasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionTasks to fetch.
     */
    orderBy?: AmbitionTasksOrderByWithRelationInput | AmbitionTasksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionTasks.
     */
    cursor?: AmbitionTasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionTasks.
     */
    distinct?: AmbitionTasksScalarFieldEnum | AmbitionTasksScalarFieldEnum[]
  }

  /**
   * AmbitionTasks findMany
   */
  export type AmbitionTasksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionTasks to fetch.
     */
    where?: AmbitionTasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionTasks to fetch.
     */
    orderBy?: AmbitionTasksOrderByWithRelationInput | AmbitionTasksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AmbitionTasks.
     */
    cursor?: AmbitionTasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionTasks.
     */
    skip?: number
    distinct?: AmbitionTasksScalarFieldEnum | AmbitionTasksScalarFieldEnum[]
  }

  /**
   * AmbitionTasks create
   */
  export type AmbitionTasksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * The data needed to create a AmbitionTasks.
     */
    data: XOR<AmbitionTasksCreateInput, AmbitionTasksUncheckedCreateInput>
  }

  /**
   * AmbitionTasks createMany
   */
  export type AmbitionTasksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AmbitionTasks.
     */
    data: AmbitionTasksCreateManyInput | AmbitionTasksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AmbitionTasks createManyAndReturn
   */
  export type AmbitionTasksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * The data used to create many AmbitionTasks.
     */
    data: AmbitionTasksCreateManyInput | AmbitionTasksCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionTasks update
   */
  export type AmbitionTasksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * The data needed to update a AmbitionTasks.
     */
    data: XOR<AmbitionTasksUpdateInput, AmbitionTasksUncheckedUpdateInput>
    /**
     * Choose, which AmbitionTasks to update.
     */
    where: AmbitionTasksWhereUniqueInput
  }

  /**
   * AmbitionTasks updateMany
   */
  export type AmbitionTasksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AmbitionTasks.
     */
    data: XOR<AmbitionTasksUpdateManyMutationInput, AmbitionTasksUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionTasks to update
     */
    where?: AmbitionTasksWhereInput
    /**
     * Limit how many AmbitionTasks to update.
     */
    limit?: number
  }

  /**
   * AmbitionTasks updateManyAndReturn
   */
  export type AmbitionTasksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * The data used to update AmbitionTasks.
     */
    data: XOR<AmbitionTasksUpdateManyMutationInput, AmbitionTasksUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionTasks to update
     */
    where?: AmbitionTasksWhereInput
    /**
     * Limit how many AmbitionTasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionTasks upsert
   */
  export type AmbitionTasksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * The filter to search for the AmbitionTasks to update in case it exists.
     */
    where: AmbitionTasksWhereUniqueInput
    /**
     * In case the AmbitionTasks found by the `where` argument doesn't exist, create a new AmbitionTasks with this data.
     */
    create: XOR<AmbitionTasksCreateInput, AmbitionTasksUncheckedCreateInput>
    /**
     * In case the AmbitionTasks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmbitionTasksUpdateInput, AmbitionTasksUncheckedUpdateInput>
  }

  /**
   * AmbitionTasks delete
   */
  export type AmbitionTasksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
    /**
     * Filter which AmbitionTasks to delete.
     */
    where: AmbitionTasksWhereUniqueInput
  }

  /**
   * AmbitionTasks deleteMany
   */
  export type AmbitionTasksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionTasks to delete
     */
    where?: AmbitionTasksWhereInput
    /**
     * Limit how many AmbitionTasks to delete.
     */
    limit?: number
  }

  /**
   * AmbitionTasks without action
   */
  export type AmbitionTasksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionTasks
     */
    select?: AmbitionTasksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionTasks
     */
    omit?: AmbitionTasksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionTasksInclude<ExtArgs> | null
  }


  /**
   * Model AmbitionMilestones
   */

  export type AggregateAmbitionMilestones = {
    _count: AmbitionMilestonesCountAggregateOutputType | null
    _min: AmbitionMilestonesMinAggregateOutputType | null
    _max: AmbitionMilestonesMaxAggregateOutputType | null
  }

  export type AmbitionMilestonesMinAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    milestone: string | null
    description: string | null
    completed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionMilestonesMaxAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    milestone: string | null
    description: string | null
    completed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionMilestonesCountAggregateOutputType = {
    id: number
    ambitionId: number
    milestone: number
    description: number
    completed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmbitionMilestonesMinAggregateInputType = {
    id?: true
    ambitionId?: true
    milestone?: true
    description?: true
    completed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionMilestonesMaxAggregateInputType = {
    id?: true
    ambitionId?: true
    milestone?: true
    description?: true
    completed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionMilestonesCountAggregateInputType = {
    id?: true
    ambitionId?: true
    milestone?: true
    description?: true
    completed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmbitionMilestonesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionMilestones to aggregate.
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionMilestones to fetch.
     */
    orderBy?: AmbitionMilestonesOrderByWithRelationInput | AmbitionMilestonesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmbitionMilestonesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AmbitionMilestones
    **/
    _count?: true | AmbitionMilestonesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmbitionMilestonesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmbitionMilestonesMaxAggregateInputType
  }

  export type GetAmbitionMilestonesAggregateType<T extends AmbitionMilestonesAggregateArgs> = {
        [P in keyof T & keyof AggregateAmbitionMilestones]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmbitionMilestones[P]>
      : GetScalarType<T[P], AggregateAmbitionMilestones[P]>
  }




  export type AmbitionMilestonesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionMilestonesWhereInput
    orderBy?: AmbitionMilestonesOrderByWithAggregationInput | AmbitionMilestonesOrderByWithAggregationInput[]
    by: AmbitionMilestonesScalarFieldEnum[] | AmbitionMilestonesScalarFieldEnum
    having?: AmbitionMilestonesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmbitionMilestonesCountAggregateInputType | true
    _min?: AmbitionMilestonesMinAggregateInputType
    _max?: AmbitionMilestonesMaxAggregateInputType
  }

  export type AmbitionMilestonesGroupByOutputType = {
    id: string
    ambitionId: string
    milestone: string
    description: string
    completed: boolean
    createdAt: Date
    updatedAt: Date
    _count: AmbitionMilestonesCountAggregateOutputType | null
    _min: AmbitionMilestonesMinAggregateOutputType | null
    _max: AmbitionMilestonesMaxAggregateOutputType | null
  }

  type GetAmbitionMilestonesGroupByPayload<T extends AmbitionMilestonesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmbitionMilestonesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmbitionMilestonesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmbitionMilestonesGroupByOutputType[P]>
            : GetScalarType<T[P], AmbitionMilestonesGroupByOutputType[P]>
        }
      >
    >


  export type AmbitionMilestonesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    milestone?: boolean
    description?: boolean
    completed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionMilestones"]>

  export type AmbitionMilestonesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    milestone?: boolean
    description?: boolean
    completed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionMilestones"]>

  export type AmbitionMilestonesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    milestone?: boolean
    description?: boolean
    completed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionMilestones"]>

  export type AmbitionMilestonesSelectScalar = {
    id?: boolean
    ambitionId?: boolean
    milestone?: boolean
    description?: boolean
    completed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmbitionMilestonesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ambitionId" | "milestone" | "description" | "completed" | "createdAt" | "updatedAt", ExtArgs["result"]["ambitionMilestones"]>
  export type AmbitionMilestonesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }
  export type AmbitionMilestonesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }
  export type AmbitionMilestonesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionMilestones$AmbitionsArgs<ExtArgs>
  }

  export type $AmbitionMilestonesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AmbitionMilestones"
    objects: {
      Ambitions: Prisma.$AmbitionsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ambitionId: string
      milestone: string
      description: string
      completed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ambitionMilestones"]>
    composites: {}
  }

  type AmbitionMilestonesGetPayload<S extends boolean | null | undefined | AmbitionMilestonesDefaultArgs> = $Result.GetResult<Prisma.$AmbitionMilestonesPayload, S>

  type AmbitionMilestonesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmbitionMilestonesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmbitionMilestonesCountAggregateInputType | true
    }

  export interface AmbitionMilestonesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AmbitionMilestones'], meta: { name: 'AmbitionMilestones' } }
    /**
     * Find zero or one AmbitionMilestones that matches the filter.
     * @param {AmbitionMilestonesFindUniqueArgs} args - Arguments to find a AmbitionMilestones
     * @example
     * // Get one AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmbitionMilestonesFindUniqueArgs>(args: SelectSubset<T, AmbitionMilestonesFindUniqueArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AmbitionMilestones that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmbitionMilestonesFindUniqueOrThrowArgs} args - Arguments to find a AmbitionMilestones
     * @example
     * // Get one AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmbitionMilestonesFindUniqueOrThrowArgs>(args: SelectSubset<T, AmbitionMilestonesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionMilestones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesFindFirstArgs} args - Arguments to find a AmbitionMilestones
     * @example
     * // Get one AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmbitionMilestonesFindFirstArgs>(args?: SelectSubset<T, AmbitionMilestonesFindFirstArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionMilestones that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesFindFirstOrThrowArgs} args - Arguments to find a AmbitionMilestones
     * @example
     * // Get one AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmbitionMilestonesFindFirstOrThrowArgs>(args?: SelectSubset<T, AmbitionMilestonesFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AmbitionMilestones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findMany()
     * 
     * // Get first 10 AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ambitionMilestonesWithIdOnly = await prisma.ambitionMilestones.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmbitionMilestonesFindManyArgs>(args?: SelectSubset<T, AmbitionMilestonesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AmbitionMilestones.
     * @param {AmbitionMilestonesCreateArgs} args - Arguments to create a AmbitionMilestones.
     * @example
     * // Create one AmbitionMilestones
     * const AmbitionMilestones = await prisma.ambitionMilestones.create({
     *   data: {
     *     // ... data to create a AmbitionMilestones
     *   }
     * })
     * 
     */
    create<T extends AmbitionMilestonesCreateArgs>(args: SelectSubset<T, AmbitionMilestonesCreateArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AmbitionMilestones.
     * @param {AmbitionMilestonesCreateManyArgs} args - Arguments to create many AmbitionMilestones.
     * @example
     * // Create many AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmbitionMilestonesCreateManyArgs>(args?: SelectSubset<T, AmbitionMilestonesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AmbitionMilestones and returns the data saved in the database.
     * @param {AmbitionMilestonesCreateManyAndReturnArgs} args - Arguments to create many AmbitionMilestones.
     * @example
     * // Create many AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AmbitionMilestones and only return the `id`
     * const ambitionMilestonesWithIdOnly = await prisma.ambitionMilestones.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmbitionMilestonesCreateManyAndReturnArgs>(args?: SelectSubset<T, AmbitionMilestonesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AmbitionMilestones.
     * @param {AmbitionMilestonesDeleteArgs} args - Arguments to delete one AmbitionMilestones.
     * @example
     * // Delete one AmbitionMilestones
     * const AmbitionMilestones = await prisma.ambitionMilestones.delete({
     *   where: {
     *     // ... filter to delete one AmbitionMilestones
     *   }
     * })
     * 
     */
    delete<T extends AmbitionMilestonesDeleteArgs>(args: SelectSubset<T, AmbitionMilestonesDeleteArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AmbitionMilestones.
     * @param {AmbitionMilestonesUpdateArgs} args - Arguments to update one AmbitionMilestones.
     * @example
     * // Update one AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmbitionMilestonesUpdateArgs>(args: SelectSubset<T, AmbitionMilestonesUpdateArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AmbitionMilestones.
     * @param {AmbitionMilestonesDeleteManyArgs} args - Arguments to filter AmbitionMilestones to delete.
     * @example
     * // Delete a few AmbitionMilestones
     * const { count } = await prisma.ambitionMilestones.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmbitionMilestonesDeleteManyArgs>(args?: SelectSubset<T, AmbitionMilestonesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmbitionMilestonesUpdateManyArgs>(args: SelectSubset<T, AmbitionMilestonesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionMilestones and returns the data updated in the database.
     * @param {AmbitionMilestonesUpdateManyAndReturnArgs} args - Arguments to update many AmbitionMilestones.
     * @example
     * // Update many AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AmbitionMilestones and only return the `id`
     * const ambitionMilestonesWithIdOnly = await prisma.ambitionMilestones.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmbitionMilestonesUpdateManyAndReturnArgs>(args: SelectSubset<T, AmbitionMilestonesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AmbitionMilestones.
     * @param {AmbitionMilestonesUpsertArgs} args - Arguments to update or create a AmbitionMilestones.
     * @example
     * // Update or create a AmbitionMilestones
     * const ambitionMilestones = await prisma.ambitionMilestones.upsert({
     *   create: {
     *     // ... data to create a AmbitionMilestones
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AmbitionMilestones we want to update
     *   }
     * })
     */
    upsert<T extends AmbitionMilestonesUpsertArgs>(args: SelectSubset<T, AmbitionMilestonesUpsertArgs<ExtArgs>>): Prisma__AmbitionMilestonesClient<$Result.GetResult<Prisma.$AmbitionMilestonesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AmbitionMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesCountArgs} args - Arguments to filter AmbitionMilestones to count.
     * @example
     * // Count the number of AmbitionMilestones
     * const count = await prisma.ambitionMilestones.count({
     *   where: {
     *     // ... the filter for the AmbitionMilestones we want to count
     *   }
     * })
    **/
    count<T extends AmbitionMilestonesCountArgs>(
      args?: Subset<T, AmbitionMilestonesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmbitionMilestonesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AmbitionMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmbitionMilestonesAggregateArgs>(args: Subset<T, AmbitionMilestonesAggregateArgs>): Prisma.PrismaPromise<GetAmbitionMilestonesAggregateType<T>>

    /**
     * Group by AmbitionMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionMilestonesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmbitionMilestonesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmbitionMilestonesGroupByArgs['orderBy'] }
        : { orderBy?: AmbitionMilestonesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmbitionMilestonesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmbitionMilestonesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AmbitionMilestones model
   */
  readonly fields: AmbitionMilestonesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AmbitionMilestones.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmbitionMilestonesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Ambitions<T extends AmbitionMilestones$AmbitionsArgs<ExtArgs> = {}>(args?: Subset<T, AmbitionMilestones$AmbitionsArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AmbitionMilestones model
   */
  interface AmbitionMilestonesFieldRefs {
    readonly id: FieldRef<"AmbitionMilestones", 'String'>
    readonly ambitionId: FieldRef<"AmbitionMilestones", 'String'>
    readonly milestone: FieldRef<"AmbitionMilestones", 'String'>
    readonly description: FieldRef<"AmbitionMilestones", 'String'>
    readonly completed: FieldRef<"AmbitionMilestones", 'Boolean'>
    readonly createdAt: FieldRef<"AmbitionMilestones", 'DateTime'>
    readonly updatedAt: FieldRef<"AmbitionMilestones", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AmbitionMilestones findUnique
   */
  export type AmbitionMilestonesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionMilestones to fetch.
     */
    where: AmbitionMilestonesWhereUniqueInput
  }

  /**
   * AmbitionMilestones findUniqueOrThrow
   */
  export type AmbitionMilestonesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionMilestones to fetch.
     */
    where: AmbitionMilestonesWhereUniqueInput
  }

  /**
   * AmbitionMilestones findFirst
   */
  export type AmbitionMilestonesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionMilestones to fetch.
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionMilestones to fetch.
     */
    orderBy?: AmbitionMilestonesOrderByWithRelationInput | AmbitionMilestonesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionMilestones.
     */
    cursor?: AmbitionMilestonesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionMilestones.
     */
    distinct?: AmbitionMilestonesScalarFieldEnum | AmbitionMilestonesScalarFieldEnum[]
  }

  /**
   * AmbitionMilestones findFirstOrThrow
   */
  export type AmbitionMilestonesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionMilestones to fetch.
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionMilestones to fetch.
     */
    orderBy?: AmbitionMilestonesOrderByWithRelationInput | AmbitionMilestonesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionMilestones.
     */
    cursor?: AmbitionMilestonesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionMilestones.
     */
    distinct?: AmbitionMilestonesScalarFieldEnum | AmbitionMilestonesScalarFieldEnum[]
  }

  /**
   * AmbitionMilestones findMany
   */
  export type AmbitionMilestonesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionMilestones to fetch.
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionMilestones to fetch.
     */
    orderBy?: AmbitionMilestonesOrderByWithRelationInput | AmbitionMilestonesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AmbitionMilestones.
     */
    cursor?: AmbitionMilestonesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionMilestones.
     */
    skip?: number
    distinct?: AmbitionMilestonesScalarFieldEnum | AmbitionMilestonesScalarFieldEnum[]
  }

  /**
   * AmbitionMilestones create
   */
  export type AmbitionMilestonesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * The data needed to create a AmbitionMilestones.
     */
    data: XOR<AmbitionMilestonesCreateInput, AmbitionMilestonesUncheckedCreateInput>
  }

  /**
   * AmbitionMilestones createMany
   */
  export type AmbitionMilestonesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AmbitionMilestones.
     */
    data: AmbitionMilestonesCreateManyInput | AmbitionMilestonesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AmbitionMilestones createManyAndReturn
   */
  export type AmbitionMilestonesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * The data used to create many AmbitionMilestones.
     */
    data: AmbitionMilestonesCreateManyInput | AmbitionMilestonesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionMilestones update
   */
  export type AmbitionMilestonesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * The data needed to update a AmbitionMilestones.
     */
    data: XOR<AmbitionMilestonesUpdateInput, AmbitionMilestonesUncheckedUpdateInput>
    /**
     * Choose, which AmbitionMilestones to update.
     */
    where: AmbitionMilestonesWhereUniqueInput
  }

  /**
   * AmbitionMilestones updateMany
   */
  export type AmbitionMilestonesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AmbitionMilestones.
     */
    data: XOR<AmbitionMilestonesUpdateManyMutationInput, AmbitionMilestonesUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionMilestones to update
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * Limit how many AmbitionMilestones to update.
     */
    limit?: number
  }

  /**
   * AmbitionMilestones updateManyAndReturn
   */
  export type AmbitionMilestonesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * The data used to update AmbitionMilestones.
     */
    data: XOR<AmbitionMilestonesUpdateManyMutationInput, AmbitionMilestonesUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionMilestones to update
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * Limit how many AmbitionMilestones to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionMilestones upsert
   */
  export type AmbitionMilestonesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * The filter to search for the AmbitionMilestones to update in case it exists.
     */
    where: AmbitionMilestonesWhereUniqueInput
    /**
     * In case the AmbitionMilestones found by the `where` argument doesn't exist, create a new AmbitionMilestones with this data.
     */
    create: XOR<AmbitionMilestonesCreateInput, AmbitionMilestonesUncheckedCreateInput>
    /**
     * In case the AmbitionMilestones was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmbitionMilestonesUpdateInput, AmbitionMilestonesUncheckedUpdateInput>
  }

  /**
   * AmbitionMilestones delete
   */
  export type AmbitionMilestonesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
    /**
     * Filter which AmbitionMilestones to delete.
     */
    where: AmbitionMilestonesWhereUniqueInput
  }

  /**
   * AmbitionMilestones deleteMany
   */
  export type AmbitionMilestonesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionMilestones to delete
     */
    where?: AmbitionMilestonesWhereInput
    /**
     * Limit how many AmbitionMilestones to delete.
     */
    limit?: number
  }

  /**
   * AmbitionMilestones.Ambitions
   */
  export type AmbitionMilestones$AmbitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    where?: AmbitionsWhereInput
  }

  /**
   * AmbitionMilestones without action
   */
  export type AmbitionMilestonesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionMilestones
     */
    select?: AmbitionMilestonesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionMilestones
     */
    omit?: AmbitionMilestonesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionMilestonesInclude<ExtArgs> | null
  }


  /**
   * Model AmbitionNotes
   */

  export type AggregateAmbitionNotes = {
    _count: AmbitionNotesCountAggregateOutputType | null
    _min: AmbitionNotesMinAggregateOutputType | null
    _max: AmbitionNotesMaxAggregateOutputType | null
  }

  export type AmbitionNotesMinAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionNotesMaxAggregateOutputType = {
    id: string | null
    ambitionId: string | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmbitionNotesCountAggregateOutputType = {
    id: number
    ambitionId: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmbitionNotesMinAggregateInputType = {
    id?: true
    ambitionId?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionNotesMaxAggregateInputType = {
    id?: true
    ambitionId?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmbitionNotesCountAggregateInputType = {
    id?: true
    ambitionId?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmbitionNotesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionNotes to aggregate.
     */
    where?: AmbitionNotesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionNotes to fetch.
     */
    orderBy?: AmbitionNotesOrderByWithRelationInput | AmbitionNotesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmbitionNotesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AmbitionNotes
    **/
    _count?: true | AmbitionNotesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmbitionNotesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmbitionNotesMaxAggregateInputType
  }

  export type GetAmbitionNotesAggregateType<T extends AmbitionNotesAggregateArgs> = {
        [P in keyof T & keyof AggregateAmbitionNotes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmbitionNotes[P]>
      : GetScalarType<T[P], AggregateAmbitionNotes[P]>
  }




  export type AmbitionNotesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbitionNotesWhereInput
    orderBy?: AmbitionNotesOrderByWithAggregationInput | AmbitionNotesOrderByWithAggregationInput[]
    by: AmbitionNotesScalarFieldEnum[] | AmbitionNotesScalarFieldEnum
    having?: AmbitionNotesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmbitionNotesCountAggregateInputType | true
    _min?: AmbitionNotesMinAggregateInputType
    _max?: AmbitionNotesMaxAggregateInputType
  }

  export type AmbitionNotesGroupByOutputType = {
    id: string
    ambitionId: string
    note: string
    createdAt: Date
    updatedAt: Date
    _count: AmbitionNotesCountAggregateOutputType | null
    _min: AmbitionNotesMinAggregateOutputType | null
    _max: AmbitionNotesMaxAggregateOutputType | null
  }

  type GetAmbitionNotesGroupByPayload<T extends AmbitionNotesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmbitionNotesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmbitionNotesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmbitionNotesGroupByOutputType[P]>
            : GetScalarType<T[P], AmbitionNotesGroupByOutputType[P]>
        }
      >
    >


  export type AmbitionNotesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionNotes"]>

  export type AmbitionNotesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionNotes"]>

  export type AmbitionNotesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ambitionId?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }, ExtArgs["result"]["ambitionNotes"]>

  export type AmbitionNotesSelectScalar = {
    id?: boolean
    ambitionId?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmbitionNotesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ambitionId" | "note" | "createdAt" | "updatedAt", ExtArgs["result"]["ambitionNotes"]>
  export type AmbitionNotesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }
  export type AmbitionNotesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }
  export type AmbitionNotesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Ambitions?: boolean | AmbitionNotes$AmbitionsArgs<ExtArgs>
  }

  export type $AmbitionNotesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AmbitionNotes"
    objects: {
      Ambitions: Prisma.$AmbitionsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ambitionId: string
      note: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ambitionNotes"]>
    composites: {}
  }

  type AmbitionNotesGetPayload<S extends boolean | null | undefined | AmbitionNotesDefaultArgs> = $Result.GetResult<Prisma.$AmbitionNotesPayload, S>

  type AmbitionNotesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmbitionNotesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmbitionNotesCountAggregateInputType | true
    }

  export interface AmbitionNotesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AmbitionNotes'], meta: { name: 'AmbitionNotes' } }
    /**
     * Find zero or one AmbitionNotes that matches the filter.
     * @param {AmbitionNotesFindUniqueArgs} args - Arguments to find a AmbitionNotes
     * @example
     * // Get one AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmbitionNotesFindUniqueArgs>(args: SelectSubset<T, AmbitionNotesFindUniqueArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AmbitionNotes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmbitionNotesFindUniqueOrThrowArgs} args - Arguments to find a AmbitionNotes
     * @example
     * // Get one AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmbitionNotesFindUniqueOrThrowArgs>(args: SelectSubset<T, AmbitionNotesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesFindFirstArgs} args - Arguments to find a AmbitionNotes
     * @example
     * // Get one AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmbitionNotesFindFirstArgs>(args?: SelectSubset<T, AmbitionNotesFindFirstArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmbitionNotes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesFindFirstOrThrowArgs} args - Arguments to find a AmbitionNotes
     * @example
     * // Get one AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmbitionNotesFindFirstOrThrowArgs>(args?: SelectSubset<T, AmbitionNotesFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AmbitionNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findMany()
     * 
     * // Get first 10 AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ambitionNotesWithIdOnly = await prisma.ambitionNotes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmbitionNotesFindManyArgs>(args?: SelectSubset<T, AmbitionNotesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AmbitionNotes.
     * @param {AmbitionNotesCreateArgs} args - Arguments to create a AmbitionNotes.
     * @example
     * // Create one AmbitionNotes
     * const AmbitionNotes = await prisma.ambitionNotes.create({
     *   data: {
     *     // ... data to create a AmbitionNotes
     *   }
     * })
     * 
     */
    create<T extends AmbitionNotesCreateArgs>(args: SelectSubset<T, AmbitionNotesCreateArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AmbitionNotes.
     * @param {AmbitionNotesCreateManyArgs} args - Arguments to create many AmbitionNotes.
     * @example
     * // Create many AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmbitionNotesCreateManyArgs>(args?: SelectSubset<T, AmbitionNotesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AmbitionNotes and returns the data saved in the database.
     * @param {AmbitionNotesCreateManyAndReturnArgs} args - Arguments to create many AmbitionNotes.
     * @example
     * // Create many AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AmbitionNotes and only return the `id`
     * const ambitionNotesWithIdOnly = await prisma.ambitionNotes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmbitionNotesCreateManyAndReturnArgs>(args?: SelectSubset<T, AmbitionNotesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AmbitionNotes.
     * @param {AmbitionNotesDeleteArgs} args - Arguments to delete one AmbitionNotes.
     * @example
     * // Delete one AmbitionNotes
     * const AmbitionNotes = await prisma.ambitionNotes.delete({
     *   where: {
     *     // ... filter to delete one AmbitionNotes
     *   }
     * })
     * 
     */
    delete<T extends AmbitionNotesDeleteArgs>(args: SelectSubset<T, AmbitionNotesDeleteArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AmbitionNotes.
     * @param {AmbitionNotesUpdateArgs} args - Arguments to update one AmbitionNotes.
     * @example
     * // Update one AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmbitionNotesUpdateArgs>(args: SelectSubset<T, AmbitionNotesUpdateArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AmbitionNotes.
     * @param {AmbitionNotesDeleteManyArgs} args - Arguments to filter AmbitionNotes to delete.
     * @example
     * // Delete a few AmbitionNotes
     * const { count } = await prisma.ambitionNotes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmbitionNotesDeleteManyArgs>(args?: SelectSubset<T, AmbitionNotesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmbitionNotesUpdateManyArgs>(args: SelectSubset<T, AmbitionNotesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmbitionNotes and returns the data updated in the database.
     * @param {AmbitionNotesUpdateManyAndReturnArgs} args - Arguments to update many AmbitionNotes.
     * @example
     * // Update many AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AmbitionNotes and only return the `id`
     * const ambitionNotesWithIdOnly = await prisma.ambitionNotes.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmbitionNotesUpdateManyAndReturnArgs>(args: SelectSubset<T, AmbitionNotesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AmbitionNotes.
     * @param {AmbitionNotesUpsertArgs} args - Arguments to update or create a AmbitionNotes.
     * @example
     * // Update or create a AmbitionNotes
     * const ambitionNotes = await prisma.ambitionNotes.upsert({
     *   create: {
     *     // ... data to create a AmbitionNotes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AmbitionNotes we want to update
     *   }
     * })
     */
    upsert<T extends AmbitionNotesUpsertArgs>(args: SelectSubset<T, AmbitionNotesUpsertArgs<ExtArgs>>): Prisma__AmbitionNotesClient<$Result.GetResult<Prisma.$AmbitionNotesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AmbitionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesCountArgs} args - Arguments to filter AmbitionNotes to count.
     * @example
     * // Count the number of AmbitionNotes
     * const count = await prisma.ambitionNotes.count({
     *   where: {
     *     // ... the filter for the AmbitionNotes we want to count
     *   }
     * })
    **/
    count<T extends AmbitionNotesCountArgs>(
      args?: Subset<T, AmbitionNotesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmbitionNotesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AmbitionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmbitionNotesAggregateArgs>(args: Subset<T, AmbitionNotesAggregateArgs>): Prisma.PrismaPromise<GetAmbitionNotesAggregateType<T>>

    /**
     * Group by AmbitionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbitionNotesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmbitionNotesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmbitionNotesGroupByArgs['orderBy'] }
        : { orderBy?: AmbitionNotesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmbitionNotesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmbitionNotesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AmbitionNotes model
   */
  readonly fields: AmbitionNotesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AmbitionNotes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmbitionNotesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Ambitions<T extends AmbitionNotes$AmbitionsArgs<ExtArgs> = {}>(args?: Subset<T, AmbitionNotes$AmbitionsArgs<ExtArgs>>): Prisma__AmbitionsClient<$Result.GetResult<Prisma.$AmbitionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AmbitionNotes model
   */
  interface AmbitionNotesFieldRefs {
    readonly id: FieldRef<"AmbitionNotes", 'String'>
    readonly ambitionId: FieldRef<"AmbitionNotes", 'String'>
    readonly note: FieldRef<"AmbitionNotes", 'String'>
    readonly createdAt: FieldRef<"AmbitionNotes", 'DateTime'>
    readonly updatedAt: FieldRef<"AmbitionNotes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AmbitionNotes findUnique
   */
  export type AmbitionNotesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionNotes to fetch.
     */
    where: AmbitionNotesWhereUniqueInput
  }

  /**
   * AmbitionNotes findUniqueOrThrow
   */
  export type AmbitionNotesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionNotes to fetch.
     */
    where: AmbitionNotesWhereUniqueInput
  }

  /**
   * AmbitionNotes findFirst
   */
  export type AmbitionNotesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionNotes to fetch.
     */
    where?: AmbitionNotesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionNotes to fetch.
     */
    orderBy?: AmbitionNotesOrderByWithRelationInput | AmbitionNotesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionNotes.
     */
    cursor?: AmbitionNotesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionNotes.
     */
    distinct?: AmbitionNotesScalarFieldEnum | AmbitionNotesScalarFieldEnum[]
  }

  /**
   * AmbitionNotes findFirstOrThrow
   */
  export type AmbitionNotesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionNotes to fetch.
     */
    where?: AmbitionNotesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionNotes to fetch.
     */
    orderBy?: AmbitionNotesOrderByWithRelationInput | AmbitionNotesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmbitionNotes.
     */
    cursor?: AmbitionNotesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmbitionNotes.
     */
    distinct?: AmbitionNotesScalarFieldEnum | AmbitionNotesScalarFieldEnum[]
  }

  /**
   * AmbitionNotes findMany
   */
  export type AmbitionNotesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter, which AmbitionNotes to fetch.
     */
    where?: AmbitionNotesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmbitionNotes to fetch.
     */
    orderBy?: AmbitionNotesOrderByWithRelationInput | AmbitionNotesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AmbitionNotes.
     */
    cursor?: AmbitionNotesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmbitionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmbitionNotes.
     */
    skip?: number
    distinct?: AmbitionNotesScalarFieldEnum | AmbitionNotesScalarFieldEnum[]
  }

  /**
   * AmbitionNotes create
   */
  export type AmbitionNotesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * The data needed to create a AmbitionNotes.
     */
    data: XOR<AmbitionNotesCreateInput, AmbitionNotesUncheckedCreateInput>
  }

  /**
   * AmbitionNotes createMany
   */
  export type AmbitionNotesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AmbitionNotes.
     */
    data: AmbitionNotesCreateManyInput | AmbitionNotesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AmbitionNotes createManyAndReturn
   */
  export type AmbitionNotesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * The data used to create many AmbitionNotes.
     */
    data: AmbitionNotesCreateManyInput | AmbitionNotesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionNotes update
   */
  export type AmbitionNotesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * The data needed to update a AmbitionNotes.
     */
    data: XOR<AmbitionNotesUpdateInput, AmbitionNotesUncheckedUpdateInput>
    /**
     * Choose, which AmbitionNotes to update.
     */
    where: AmbitionNotesWhereUniqueInput
  }

  /**
   * AmbitionNotes updateMany
   */
  export type AmbitionNotesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AmbitionNotes.
     */
    data: XOR<AmbitionNotesUpdateManyMutationInput, AmbitionNotesUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionNotes to update
     */
    where?: AmbitionNotesWhereInput
    /**
     * Limit how many AmbitionNotes to update.
     */
    limit?: number
  }

  /**
   * AmbitionNotes updateManyAndReturn
   */
  export type AmbitionNotesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * The data used to update AmbitionNotes.
     */
    data: XOR<AmbitionNotesUpdateManyMutationInput, AmbitionNotesUncheckedUpdateManyInput>
    /**
     * Filter which AmbitionNotes to update
     */
    where?: AmbitionNotesWhereInput
    /**
     * Limit how many AmbitionNotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AmbitionNotes upsert
   */
  export type AmbitionNotesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * The filter to search for the AmbitionNotes to update in case it exists.
     */
    where: AmbitionNotesWhereUniqueInput
    /**
     * In case the AmbitionNotes found by the `where` argument doesn't exist, create a new AmbitionNotes with this data.
     */
    create: XOR<AmbitionNotesCreateInput, AmbitionNotesUncheckedCreateInput>
    /**
     * In case the AmbitionNotes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmbitionNotesUpdateInput, AmbitionNotesUncheckedUpdateInput>
  }

  /**
   * AmbitionNotes delete
   */
  export type AmbitionNotesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
    /**
     * Filter which AmbitionNotes to delete.
     */
    where: AmbitionNotesWhereUniqueInput
  }

  /**
   * AmbitionNotes deleteMany
   */
  export type AmbitionNotesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmbitionNotes to delete
     */
    where?: AmbitionNotesWhereInput
    /**
     * Limit how many AmbitionNotes to delete.
     */
    limit?: number
  }

  /**
   * AmbitionNotes.Ambitions
   */
  export type AmbitionNotes$AmbitionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambitions
     */
    select?: AmbitionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ambitions
     */
    omit?: AmbitionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionsInclude<ExtArgs> | null
    where?: AmbitionsWhereInput
  }

  /**
   * AmbitionNotes without action
   */
  export type AmbitionNotesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbitionNotes
     */
    select?: AmbitionNotesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmbitionNotes
     */
    omit?: AmbitionNotesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbitionNotesInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AmbitionsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    description: 'description',
    category: 'category',
    priority: 'priority',
    deadline: 'deadline',
    themeColor: 'themeColor',
    trackingMethod: 'trackingMethod',
    timeTrackingStart: 'timeTrackingStart',
    timeTrackingEnd: 'timeTrackingEnd',
    timeTrackingDuration: 'timeTrackingDuration',
    timeTrackingUnit: 'timeTrackingUnit',
    timeTrackingStatus: 'timeTrackingStatus',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AmbitionsScalarFieldEnum = (typeof AmbitionsScalarFieldEnum)[keyof typeof AmbitionsScalarFieldEnum]


  export const AmbitionTasksScalarFieldEnum: {
    id: 'id',
    ambitionId: 'ambitionId',
    task: 'task',
    description: 'description',
    completed: 'completed',
    deadline: 'deadline',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AmbitionTasksScalarFieldEnum = (typeof AmbitionTasksScalarFieldEnum)[keyof typeof AmbitionTasksScalarFieldEnum]


  export const AmbitionMilestonesScalarFieldEnum: {
    id: 'id',
    ambitionId: 'ambitionId',
    milestone: 'milestone',
    description: 'description',
    completed: 'completed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AmbitionMilestonesScalarFieldEnum = (typeof AmbitionMilestonesScalarFieldEnum)[keyof typeof AmbitionMilestonesScalarFieldEnum]


  export const AmbitionNotesScalarFieldEnum: {
    id: 'id',
    ambitionId: 'ambitionId',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AmbitionNotesScalarFieldEnum = (typeof AmbitionNotesScalarFieldEnum)[keyof typeof AmbitionNotesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Priority'
   */
  export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>
    


  /**
   * Reference to a field of type 'Priority[]'
   */
  export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>
    


  /**
   * Reference to a field of type 'TrackingMethod'
   */
  export type EnumTrackingMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingMethod'>
    


  /**
   * Reference to a field of type 'TrackingMethod[]'
   */
  export type ListEnumTrackingMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingMethod[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AmbitionStatus'
   */
  export type EnumAmbitionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AmbitionStatus'>
    


  /**
   * Reference to a field of type 'AmbitionStatus[]'
   */
  export type ListEnumAmbitionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AmbitionStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    Ambitions?: AmbitionsListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Ambitions?: AmbitionsOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    Ambitions?: AmbitionsListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AmbitionsWhereInput = {
    AND?: AmbitionsWhereInput | AmbitionsWhereInput[]
    OR?: AmbitionsWhereInput[]
    NOT?: AmbitionsWhereInput | AmbitionsWhereInput[]
    id?: StringFilter<"Ambitions"> | string
    userId?: StringFilter<"Ambitions"> | string
    title?: StringFilter<"Ambitions"> | string
    description?: StringFilter<"Ambitions"> | string
    category?: StringFilter<"Ambitions"> | string
    priority?: EnumPriorityFilter<"Ambitions"> | $Enums.Priority
    deadline?: DateTimeFilter<"Ambitions"> | Date | string
    themeColor?: StringFilter<"Ambitions"> | string
    trackingMethod?: EnumTrackingMethodFilter<"Ambitions"> | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingEnd?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingDuration?: IntFilter<"Ambitions"> | number
    timeTrackingUnit?: StringFilter<"Ambitions"> | string
    timeTrackingStatus?: StringFilter<"Ambitions"> | string
    status?: EnumAmbitionStatusFilter<"Ambitions"> | $Enums.AmbitionStatus
    createdAt?: DateTimeFilter<"Ambitions"> | Date | string
    updatedAt?: DateTimeFilter<"Ambitions"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tasks?: AmbitionTasksListRelationFilter
    milestones?: AmbitionMilestonesListRelationFilter
    notes?: AmbitionNotesListRelationFilter
  }

  export type AmbitionsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    priority?: SortOrder
    deadline?: SortOrder
    themeColor?: SortOrder
    trackingMethod?: SortOrder
    timeTrackingStart?: SortOrder
    timeTrackingEnd?: SortOrder
    timeTrackingDuration?: SortOrder
    timeTrackingUnit?: SortOrder
    timeTrackingStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    tasks?: AmbitionTasksOrderByRelationAggregateInput
    milestones?: AmbitionMilestonesOrderByRelationAggregateInput
    notes?: AmbitionNotesOrderByRelationAggregateInput
  }

  export type AmbitionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmbitionsWhereInput | AmbitionsWhereInput[]
    OR?: AmbitionsWhereInput[]
    NOT?: AmbitionsWhereInput | AmbitionsWhereInput[]
    userId?: StringFilter<"Ambitions"> | string
    title?: StringFilter<"Ambitions"> | string
    description?: StringFilter<"Ambitions"> | string
    category?: StringFilter<"Ambitions"> | string
    priority?: EnumPriorityFilter<"Ambitions"> | $Enums.Priority
    deadline?: DateTimeFilter<"Ambitions"> | Date | string
    themeColor?: StringFilter<"Ambitions"> | string
    trackingMethod?: EnumTrackingMethodFilter<"Ambitions"> | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingEnd?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingDuration?: IntFilter<"Ambitions"> | number
    timeTrackingUnit?: StringFilter<"Ambitions"> | string
    timeTrackingStatus?: StringFilter<"Ambitions"> | string
    status?: EnumAmbitionStatusFilter<"Ambitions"> | $Enums.AmbitionStatus
    createdAt?: DateTimeFilter<"Ambitions"> | Date | string
    updatedAt?: DateTimeFilter<"Ambitions"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tasks?: AmbitionTasksListRelationFilter
    milestones?: AmbitionMilestonesListRelationFilter
    notes?: AmbitionNotesListRelationFilter
  }, "id">

  export type AmbitionsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    priority?: SortOrder
    deadline?: SortOrder
    themeColor?: SortOrder
    trackingMethod?: SortOrder
    timeTrackingStart?: SortOrder
    timeTrackingEnd?: SortOrder
    timeTrackingDuration?: SortOrder
    timeTrackingUnit?: SortOrder
    timeTrackingStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AmbitionsCountOrderByAggregateInput
    _avg?: AmbitionsAvgOrderByAggregateInput
    _max?: AmbitionsMaxOrderByAggregateInput
    _min?: AmbitionsMinOrderByAggregateInput
    _sum?: AmbitionsSumOrderByAggregateInput
  }

  export type AmbitionsScalarWhereWithAggregatesInput = {
    AND?: AmbitionsScalarWhereWithAggregatesInput | AmbitionsScalarWhereWithAggregatesInput[]
    OR?: AmbitionsScalarWhereWithAggregatesInput[]
    NOT?: AmbitionsScalarWhereWithAggregatesInput | AmbitionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ambitions"> | string
    userId?: StringWithAggregatesFilter<"Ambitions"> | string
    title?: StringWithAggregatesFilter<"Ambitions"> | string
    description?: StringWithAggregatesFilter<"Ambitions"> | string
    category?: StringWithAggregatesFilter<"Ambitions"> | string
    priority?: EnumPriorityWithAggregatesFilter<"Ambitions"> | $Enums.Priority
    deadline?: DateTimeWithAggregatesFilter<"Ambitions"> | Date | string
    themeColor?: StringWithAggregatesFilter<"Ambitions"> | string
    trackingMethod?: EnumTrackingMethodWithAggregatesFilter<"Ambitions"> | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeWithAggregatesFilter<"Ambitions"> | Date | string
    timeTrackingEnd?: DateTimeWithAggregatesFilter<"Ambitions"> | Date | string
    timeTrackingDuration?: IntWithAggregatesFilter<"Ambitions"> | number
    timeTrackingUnit?: StringWithAggregatesFilter<"Ambitions"> | string
    timeTrackingStatus?: StringWithAggregatesFilter<"Ambitions"> | string
    status?: EnumAmbitionStatusWithAggregatesFilter<"Ambitions"> | $Enums.AmbitionStatus
    createdAt?: DateTimeWithAggregatesFilter<"Ambitions"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ambitions"> | Date | string
  }

  export type AmbitionTasksWhereInput = {
    AND?: AmbitionTasksWhereInput | AmbitionTasksWhereInput[]
    OR?: AmbitionTasksWhereInput[]
    NOT?: AmbitionTasksWhereInput | AmbitionTasksWhereInput[]
    id?: StringFilter<"AmbitionTasks"> | string
    ambitionId?: StringFilter<"AmbitionTasks"> | string
    task?: StringFilter<"AmbitionTasks"> | string
    description?: StringFilter<"AmbitionTasks"> | string
    completed?: BoolFilter<"AmbitionTasks"> | boolean
    deadline?: DateTimeFilter<"AmbitionTasks"> | Date | string
    createdAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
    ambition?: XOR<AmbitionsScalarRelationFilter, AmbitionsWhereInput>
  }

  export type AmbitionTasksOrderByWithRelationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    task?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ambition?: AmbitionsOrderByWithRelationInput
  }

  export type AmbitionTasksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmbitionTasksWhereInput | AmbitionTasksWhereInput[]
    OR?: AmbitionTasksWhereInput[]
    NOT?: AmbitionTasksWhereInput | AmbitionTasksWhereInput[]
    ambitionId?: StringFilter<"AmbitionTasks"> | string
    task?: StringFilter<"AmbitionTasks"> | string
    description?: StringFilter<"AmbitionTasks"> | string
    completed?: BoolFilter<"AmbitionTasks"> | boolean
    deadline?: DateTimeFilter<"AmbitionTasks"> | Date | string
    createdAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
    ambition?: XOR<AmbitionsScalarRelationFilter, AmbitionsWhereInput>
  }, "id">

  export type AmbitionTasksOrderByWithAggregationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    task?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AmbitionTasksCountOrderByAggregateInput
    _max?: AmbitionTasksMaxOrderByAggregateInput
    _min?: AmbitionTasksMinOrderByAggregateInput
  }

  export type AmbitionTasksScalarWhereWithAggregatesInput = {
    AND?: AmbitionTasksScalarWhereWithAggregatesInput | AmbitionTasksScalarWhereWithAggregatesInput[]
    OR?: AmbitionTasksScalarWhereWithAggregatesInput[]
    NOT?: AmbitionTasksScalarWhereWithAggregatesInput | AmbitionTasksScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AmbitionTasks"> | string
    ambitionId?: StringWithAggregatesFilter<"AmbitionTasks"> | string
    task?: StringWithAggregatesFilter<"AmbitionTasks"> | string
    description?: StringWithAggregatesFilter<"AmbitionTasks"> | string
    completed?: BoolWithAggregatesFilter<"AmbitionTasks"> | boolean
    deadline?: DateTimeWithAggregatesFilter<"AmbitionTasks"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"AmbitionTasks"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AmbitionTasks"> | Date | string
  }

  export type AmbitionMilestonesWhereInput = {
    AND?: AmbitionMilestonesWhereInput | AmbitionMilestonesWhereInput[]
    OR?: AmbitionMilestonesWhereInput[]
    NOT?: AmbitionMilestonesWhereInput | AmbitionMilestonesWhereInput[]
    id?: StringFilter<"AmbitionMilestones"> | string
    ambitionId?: StringFilter<"AmbitionMilestones"> | string
    milestone?: StringFilter<"AmbitionMilestones"> | string
    description?: StringFilter<"AmbitionMilestones"> | string
    completed?: BoolFilter<"AmbitionMilestones"> | boolean
    createdAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
    Ambitions?: XOR<AmbitionsNullableScalarRelationFilter, AmbitionsWhereInput> | null
  }

  export type AmbitionMilestonesOrderByWithRelationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    milestone?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Ambitions?: AmbitionsOrderByWithRelationInput
  }

  export type AmbitionMilestonesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmbitionMilestonesWhereInput | AmbitionMilestonesWhereInput[]
    OR?: AmbitionMilestonesWhereInput[]
    NOT?: AmbitionMilestonesWhereInput | AmbitionMilestonesWhereInput[]
    ambitionId?: StringFilter<"AmbitionMilestones"> | string
    milestone?: StringFilter<"AmbitionMilestones"> | string
    description?: StringFilter<"AmbitionMilestones"> | string
    completed?: BoolFilter<"AmbitionMilestones"> | boolean
    createdAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
    Ambitions?: XOR<AmbitionsNullableScalarRelationFilter, AmbitionsWhereInput> | null
  }, "id">

  export type AmbitionMilestonesOrderByWithAggregationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    milestone?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AmbitionMilestonesCountOrderByAggregateInput
    _max?: AmbitionMilestonesMaxOrderByAggregateInput
    _min?: AmbitionMilestonesMinOrderByAggregateInput
  }

  export type AmbitionMilestonesScalarWhereWithAggregatesInput = {
    AND?: AmbitionMilestonesScalarWhereWithAggregatesInput | AmbitionMilestonesScalarWhereWithAggregatesInput[]
    OR?: AmbitionMilestonesScalarWhereWithAggregatesInput[]
    NOT?: AmbitionMilestonesScalarWhereWithAggregatesInput | AmbitionMilestonesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AmbitionMilestones"> | string
    ambitionId?: StringWithAggregatesFilter<"AmbitionMilestones"> | string
    milestone?: StringWithAggregatesFilter<"AmbitionMilestones"> | string
    description?: StringWithAggregatesFilter<"AmbitionMilestones"> | string
    completed?: BoolWithAggregatesFilter<"AmbitionMilestones"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AmbitionMilestones"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AmbitionMilestones"> | Date | string
  }

  export type AmbitionNotesWhereInput = {
    AND?: AmbitionNotesWhereInput | AmbitionNotesWhereInput[]
    OR?: AmbitionNotesWhereInput[]
    NOT?: AmbitionNotesWhereInput | AmbitionNotesWhereInput[]
    id?: StringFilter<"AmbitionNotes"> | string
    ambitionId?: StringFilter<"AmbitionNotes"> | string
    note?: StringFilter<"AmbitionNotes"> | string
    createdAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
    Ambitions?: XOR<AmbitionsNullableScalarRelationFilter, AmbitionsWhereInput> | null
  }

  export type AmbitionNotesOrderByWithRelationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Ambitions?: AmbitionsOrderByWithRelationInput
  }

  export type AmbitionNotesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmbitionNotesWhereInput | AmbitionNotesWhereInput[]
    OR?: AmbitionNotesWhereInput[]
    NOT?: AmbitionNotesWhereInput | AmbitionNotesWhereInput[]
    ambitionId?: StringFilter<"AmbitionNotes"> | string
    note?: StringFilter<"AmbitionNotes"> | string
    createdAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
    Ambitions?: XOR<AmbitionsNullableScalarRelationFilter, AmbitionsWhereInput> | null
  }, "id">

  export type AmbitionNotesOrderByWithAggregationInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AmbitionNotesCountOrderByAggregateInput
    _max?: AmbitionNotesMaxOrderByAggregateInput
    _min?: AmbitionNotesMinOrderByAggregateInput
  }

  export type AmbitionNotesScalarWhereWithAggregatesInput = {
    AND?: AmbitionNotesScalarWhereWithAggregatesInput | AmbitionNotesScalarWhereWithAggregatesInput[]
    OR?: AmbitionNotesScalarWhereWithAggregatesInput[]
    NOT?: AmbitionNotesScalarWhereWithAggregatesInput | AmbitionNotesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AmbitionNotes"> | string
    ambitionId?: StringWithAggregatesFilter<"AmbitionNotes"> | string
    note?: StringWithAggregatesFilter<"AmbitionNotes"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AmbitionNotes"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AmbitionNotes"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Ambitions?: AmbitionsCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Ambitions?: AmbitionsUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Ambitions?: AmbitionsUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Ambitions?: AmbitionsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionsCreateInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAmbitionsInput
    tasks?: AmbitionTasksCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: AmbitionTasksUncheckedCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesUncheckedCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesUncheckedCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAmbitionsNestedInput
    tasks?: AmbitionTasksUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: AmbitionTasksUncheckedUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUncheckedUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsCreateManyInput = {
    id?: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksCreateInput = {
    id?: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    ambition: AmbitionsCreateNestedOneWithoutTasksInput
  }

  export type AmbitionTasksUncheckedCreateInput = {
    id?: string
    ambitionId: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionTasksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ambition?: AmbitionsUpdateOneRequiredWithoutTasksNestedInput
  }

  export type AmbitionTasksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksCreateManyInput = {
    id?: string
    ambitionId: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionTasksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesCreateInput = {
    id?: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    Ambitions?: AmbitionsCreateNestedOneWithoutMilestonesInput
  }

  export type AmbitionMilestonesUncheckedCreateInput = {
    id?: string
    ambitionId: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionMilestonesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Ambitions?: AmbitionsUpdateOneWithoutMilestonesNestedInput
  }

  export type AmbitionMilestonesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesCreateManyInput = {
    id?: string
    ambitionId: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionMilestonesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesCreateInput = {
    id?: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Ambitions?: AmbitionsCreateNestedOneWithoutNotesInput
  }

  export type AmbitionNotesUncheckedCreateInput = {
    id?: string
    ambitionId: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionNotesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Ambitions?: AmbitionsUpdateOneWithoutNotesNestedInput
  }

  export type AmbitionNotesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesCreateManyInput = {
    id?: string
    ambitionId: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionNotesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ambitionId?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AmbitionsListRelationFilter = {
    every?: AmbitionsWhereInput
    some?: AmbitionsWhereInput
    none?: AmbitionsWhereInput
  }

  export type AmbitionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type EnumTrackingMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingMethod | EnumTrackingMethodFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingMethodFilter<$PrismaModel> | $Enums.TrackingMethod
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumAmbitionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbitionStatus | EnumAmbitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbitionStatusFilter<$PrismaModel> | $Enums.AmbitionStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AmbitionTasksListRelationFilter = {
    every?: AmbitionTasksWhereInput
    some?: AmbitionTasksWhereInput
    none?: AmbitionTasksWhereInput
  }

  export type AmbitionMilestonesListRelationFilter = {
    every?: AmbitionMilestonesWhereInput
    some?: AmbitionMilestonesWhereInput
    none?: AmbitionMilestonesWhereInput
  }

  export type AmbitionNotesListRelationFilter = {
    every?: AmbitionNotesWhereInput
    some?: AmbitionNotesWhereInput
    none?: AmbitionNotesWhereInput
  }

  export type AmbitionTasksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AmbitionMilestonesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AmbitionNotesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AmbitionsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    priority?: SortOrder
    deadline?: SortOrder
    themeColor?: SortOrder
    trackingMethod?: SortOrder
    timeTrackingStart?: SortOrder
    timeTrackingEnd?: SortOrder
    timeTrackingDuration?: SortOrder
    timeTrackingUnit?: SortOrder
    timeTrackingStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionsAvgOrderByAggregateInput = {
    timeTrackingDuration?: SortOrder
  }

  export type AmbitionsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    priority?: SortOrder
    deadline?: SortOrder
    themeColor?: SortOrder
    trackingMethod?: SortOrder
    timeTrackingStart?: SortOrder
    timeTrackingEnd?: SortOrder
    timeTrackingDuration?: SortOrder
    timeTrackingUnit?: SortOrder
    timeTrackingStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    priority?: SortOrder
    deadline?: SortOrder
    themeColor?: SortOrder
    trackingMethod?: SortOrder
    timeTrackingStart?: SortOrder
    timeTrackingEnd?: SortOrder
    timeTrackingDuration?: SortOrder
    timeTrackingUnit?: SortOrder
    timeTrackingStatus?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionsSumOrderByAggregateInput = {
    timeTrackingDuration?: SortOrder
  }

  export type EnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type EnumTrackingMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingMethod | EnumTrackingMethodFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingMethodWithAggregatesFilter<$PrismaModel> | $Enums.TrackingMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingMethodFilter<$PrismaModel>
    _max?: NestedEnumTrackingMethodFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumAmbitionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbitionStatus | EnumAmbitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbitionStatusWithAggregatesFilter<$PrismaModel> | $Enums.AmbitionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAmbitionStatusFilter<$PrismaModel>
    _max?: NestedEnumAmbitionStatusFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AmbitionsScalarRelationFilter = {
    is?: AmbitionsWhereInput
    isNot?: AmbitionsWhereInput
  }

  export type AmbitionTasksCountOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    task?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionTasksMaxOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    task?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionTasksMinOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    task?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AmbitionsNullableScalarRelationFilter = {
    is?: AmbitionsWhereInput | null
    isNot?: AmbitionsWhereInput | null
  }

  export type AmbitionMilestonesCountOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    milestone?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionMilestonesMaxOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    milestone?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionMilestonesMinOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    milestone?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionNotesCountOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionNotesMaxOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionNotesMinOrderByAggregateInput = {
    id?: SortOrder
    ambitionId?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmbitionsCreateNestedManyWithoutUserInput = {
    create?: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput> | AmbitionsCreateWithoutUserInput[] | AmbitionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AmbitionsCreateOrConnectWithoutUserInput | AmbitionsCreateOrConnectWithoutUserInput[]
    createMany?: AmbitionsCreateManyUserInputEnvelope
    connect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
  }

  export type AmbitionsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput> | AmbitionsCreateWithoutUserInput[] | AmbitionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AmbitionsCreateOrConnectWithoutUserInput | AmbitionsCreateOrConnectWithoutUserInput[]
    createMany?: AmbitionsCreateManyUserInputEnvelope
    connect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AmbitionsUpdateManyWithoutUserNestedInput = {
    create?: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput> | AmbitionsCreateWithoutUserInput[] | AmbitionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AmbitionsCreateOrConnectWithoutUserInput | AmbitionsCreateOrConnectWithoutUserInput[]
    upsert?: AmbitionsUpsertWithWhereUniqueWithoutUserInput | AmbitionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AmbitionsCreateManyUserInputEnvelope
    set?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    disconnect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    delete?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    connect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    update?: AmbitionsUpdateWithWhereUniqueWithoutUserInput | AmbitionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AmbitionsUpdateManyWithWhereWithoutUserInput | AmbitionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AmbitionsScalarWhereInput | AmbitionsScalarWhereInput[]
  }

  export type AmbitionsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput> | AmbitionsCreateWithoutUserInput[] | AmbitionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AmbitionsCreateOrConnectWithoutUserInput | AmbitionsCreateOrConnectWithoutUserInput[]
    upsert?: AmbitionsUpsertWithWhereUniqueWithoutUserInput | AmbitionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AmbitionsCreateManyUserInputEnvelope
    set?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    disconnect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    delete?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    connect?: AmbitionsWhereUniqueInput | AmbitionsWhereUniqueInput[]
    update?: AmbitionsUpdateWithWhereUniqueWithoutUserInput | AmbitionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AmbitionsUpdateManyWithWhereWithoutUserInput | AmbitionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AmbitionsScalarWhereInput | AmbitionsScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAmbitionsInput = {
    create?: XOR<UserCreateWithoutAmbitionsInput, UserUncheckedCreateWithoutAmbitionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAmbitionsInput
    connect?: UserWhereUniqueInput
  }

  export type AmbitionTasksCreateNestedManyWithoutAmbitionInput = {
    create?: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput> | AmbitionTasksCreateWithoutAmbitionInput[] | AmbitionTasksUncheckedCreateWithoutAmbitionInput[]
    connectOrCreate?: AmbitionTasksCreateOrConnectWithoutAmbitionInput | AmbitionTasksCreateOrConnectWithoutAmbitionInput[]
    createMany?: AmbitionTasksCreateManyAmbitionInputEnvelope
    connect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
  }

  export type AmbitionMilestonesCreateNestedManyWithoutAmbitionsInput = {
    create?: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput> | AmbitionMilestonesCreateWithoutAmbitionsInput[] | AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput | AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput[]
    createMany?: AmbitionMilestonesCreateManyAmbitionsInputEnvelope
    connect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
  }

  export type AmbitionNotesCreateNestedManyWithoutAmbitionsInput = {
    create?: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput> | AmbitionNotesCreateWithoutAmbitionsInput[] | AmbitionNotesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionNotesCreateOrConnectWithoutAmbitionsInput | AmbitionNotesCreateOrConnectWithoutAmbitionsInput[]
    createMany?: AmbitionNotesCreateManyAmbitionsInputEnvelope
    connect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
  }

  export type AmbitionTasksUncheckedCreateNestedManyWithoutAmbitionInput = {
    create?: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput> | AmbitionTasksCreateWithoutAmbitionInput[] | AmbitionTasksUncheckedCreateWithoutAmbitionInput[]
    connectOrCreate?: AmbitionTasksCreateOrConnectWithoutAmbitionInput | AmbitionTasksCreateOrConnectWithoutAmbitionInput[]
    createMany?: AmbitionTasksCreateManyAmbitionInputEnvelope
    connect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
  }

  export type AmbitionMilestonesUncheckedCreateNestedManyWithoutAmbitionsInput = {
    create?: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput> | AmbitionMilestonesCreateWithoutAmbitionsInput[] | AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput | AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput[]
    createMany?: AmbitionMilestonesCreateManyAmbitionsInputEnvelope
    connect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
  }

  export type AmbitionNotesUncheckedCreateNestedManyWithoutAmbitionsInput = {
    create?: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput> | AmbitionNotesCreateWithoutAmbitionsInput[] | AmbitionNotesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionNotesCreateOrConnectWithoutAmbitionsInput | AmbitionNotesCreateOrConnectWithoutAmbitionsInput[]
    createMany?: AmbitionNotesCreateManyAmbitionsInputEnvelope
    connect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
  }

  export type EnumPriorityFieldUpdateOperationsInput = {
    set?: $Enums.Priority
  }

  export type EnumTrackingMethodFieldUpdateOperationsInput = {
    set?: $Enums.TrackingMethod
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAmbitionStatusFieldUpdateOperationsInput = {
    set?: $Enums.AmbitionStatus
  }

  export type UserUpdateOneRequiredWithoutAmbitionsNestedInput = {
    create?: XOR<UserCreateWithoutAmbitionsInput, UserUncheckedCreateWithoutAmbitionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAmbitionsInput
    upsert?: UserUpsertWithoutAmbitionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAmbitionsInput, UserUpdateWithoutAmbitionsInput>, UserUncheckedUpdateWithoutAmbitionsInput>
  }

  export type AmbitionTasksUpdateManyWithoutAmbitionNestedInput = {
    create?: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput> | AmbitionTasksCreateWithoutAmbitionInput[] | AmbitionTasksUncheckedCreateWithoutAmbitionInput[]
    connectOrCreate?: AmbitionTasksCreateOrConnectWithoutAmbitionInput | AmbitionTasksCreateOrConnectWithoutAmbitionInput[]
    upsert?: AmbitionTasksUpsertWithWhereUniqueWithoutAmbitionInput | AmbitionTasksUpsertWithWhereUniqueWithoutAmbitionInput[]
    createMany?: AmbitionTasksCreateManyAmbitionInputEnvelope
    set?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    disconnect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    delete?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    connect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    update?: AmbitionTasksUpdateWithWhereUniqueWithoutAmbitionInput | AmbitionTasksUpdateWithWhereUniqueWithoutAmbitionInput[]
    updateMany?: AmbitionTasksUpdateManyWithWhereWithoutAmbitionInput | AmbitionTasksUpdateManyWithWhereWithoutAmbitionInput[]
    deleteMany?: AmbitionTasksScalarWhereInput | AmbitionTasksScalarWhereInput[]
  }

  export type AmbitionMilestonesUpdateManyWithoutAmbitionsNestedInput = {
    create?: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput> | AmbitionMilestonesCreateWithoutAmbitionsInput[] | AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput | AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput[]
    upsert?: AmbitionMilestonesUpsertWithWhereUniqueWithoutAmbitionsInput | AmbitionMilestonesUpsertWithWhereUniqueWithoutAmbitionsInput[]
    createMany?: AmbitionMilestonesCreateManyAmbitionsInputEnvelope
    set?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    disconnect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    delete?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    connect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    update?: AmbitionMilestonesUpdateWithWhereUniqueWithoutAmbitionsInput | AmbitionMilestonesUpdateWithWhereUniqueWithoutAmbitionsInput[]
    updateMany?: AmbitionMilestonesUpdateManyWithWhereWithoutAmbitionsInput | AmbitionMilestonesUpdateManyWithWhereWithoutAmbitionsInput[]
    deleteMany?: AmbitionMilestonesScalarWhereInput | AmbitionMilestonesScalarWhereInput[]
  }

  export type AmbitionNotesUpdateManyWithoutAmbitionsNestedInput = {
    create?: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput> | AmbitionNotesCreateWithoutAmbitionsInput[] | AmbitionNotesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionNotesCreateOrConnectWithoutAmbitionsInput | AmbitionNotesCreateOrConnectWithoutAmbitionsInput[]
    upsert?: AmbitionNotesUpsertWithWhereUniqueWithoutAmbitionsInput | AmbitionNotesUpsertWithWhereUniqueWithoutAmbitionsInput[]
    createMany?: AmbitionNotesCreateManyAmbitionsInputEnvelope
    set?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    disconnect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    delete?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    connect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    update?: AmbitionNotesUpdateWithWhereUniqueWithoutAmbitionsInput | AmbitionNotesUpdateWithWhereUniqueWithoutAmbitionsInput[]
    updateMany?: AmbitionNotesUpdateManyWithWhereWithoutAmbitionsInput | AmbitionNotesUpdateManyWithWhereWithoutAmbitionsInput[]
    deleteMany?: AmbitionNotesScalarWhereInput | AmbitionNotesScalarWhereInput[]
  }

  export type AmbitionTasksUncheckedUpdateManyWithoutAmbitionNestedInput = {
    create?: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput> | AmbitionTasksCreateWithoutAmbitionInput[] | AmbitionTasksUncheckedCreateWithoutAmbitionInput[]
    connectOrCreate?: AmbitionTasksCreateOrConnectWithoutAmbitionInput | AmbitionTasksCreateOrConnectWithoutAmbitionInput[]
    upsert?: AmbitionTasksUpsertWithWhereUniqueWithoutAmbitionInput | AmbitionTasksUpsertWithWhereUniqueWithoutAmbitionInput[]
    createMany?: AmbitionTasksCreateManyAmbitionInputEnvelope
    set?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    disconnect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    delete?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    connect?: AmbitionTasksWhereUniqueInput | AmbitionTasksWhereUniqueInput[]
    update?: AmbitionTasksUpdateWithWhereUniqueWithoutAmbitionInput | AmbitionTasksUpdateWithWhereUniqueWithoutAmbitionInput[]
    updateMany?: AmbitionTasksUpdateManyWithWhereWithoutAmbitionInput | AmbitionTasksUpdateManyWithWhereWithoutAmbitionInput[]
    deleteMany?: AmbitionTasksScalarWhereInput | AmbitionTasksScalarWhereInput[]
  }

  export type AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsNestedInput = {
    create?: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput> | AmbitionMilestonesCreateWithoutAmbitionsInput[] | AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput | AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput[]
    upsert?: AmbitionMilestonesUpsertWithWhereUniqueWithoutAmbitionsInput | AmbitionMilestonesUpsertWithWhereUniqueWithoutAmbitionsInput[]
    createMany?: AmbitionMilestonesCreateManyAmbitionsInputEnvelope
    set?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    disconnect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    delete?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    connect?: AmbitionMilestonesWhereUniqueInput | AmbitionMilestonesWhereUniqueInput[]
    update?: AmbitionMilestonesUpdateWithWhereUniqueWithoutAmbitionsInput | AmbitionMilestonesUpdateWithWhereUniqueWithoutAmbitionsInput[]
    updateMany?: AmbitionMilestonesUpdateManyWithWhereWithoutAmbitionsInput | AmbitionMilestonesUpdateManyWithWhereWithoutAmbitionsInput[]
    deleteMany?: AmbitionMilestonesScalarWhereInput | AmbitionMilestonesScalarWhereInput[]
  }

  export type AmbitionNotesUncheckedUpdateManyWithoutAmbitionsNestedInput = {
    create?: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput> | AmbitionNotesCreateWithoutAmbitionsInput[] | AmbitionNotesUncheckedCreateWithoutAmbitionsInput[]
    connectOrCreate?: AmbitionNotesCreateOrConnectWithoutAmbitionsInput | AmbitionNotesCreateOrConnectWithoutAmbitionsInput[]
    upsert?: AmbitionNotesUpsertWithWhereUniqueWithoutAmbitionsInput | AmbitionNotesUpsertWithWhereUniqueWithoutAmbitionsInput[]
    createMany?: AmbitionNotesCreateManyAmbitionsInputEnvelope
    set?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    disconnect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    delete?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    connect?: AmbitionNotesWhereUniqueInput | AmbitionNotesWhereUniqueInput[]
    update?: AmbitionNotesUpdateWithWhereUniqueWithoutAmbitionsInput | AmbitionNotesUpdateWithWhereUniqueWithoutAmbitionsInput[]
    updateMany?: AmbitionNotesUpdateManyWithWhereWithoutAmbitionsInput | AmbitionNotesUpdateManyWithWhereWithoutAmbitionsInput[]
    deleteMany?: AmbitionNotesScalarWhereInput | AmbitionNotesScalarWhereInput[]
  }

  export type AmbitionsCreateNestedOneWithoutTasksInput = {
    create?: XOR<AmbitionsCreateWithoutTasksInput, AmbitionsUncheckedCreateWithoutTasksInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutTasksInput
    connect?: AmbitionsWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AmbitionsUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<AmbitionsCreateWithoutTasksInput, AmbitionsUncheckedCreateWithoutTasksInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutTasksInput
    upsert?: AmbitionsUpsertWithoutTasksInput
    connect?: AmbitionsWhereUniqueInput
    update?: XOR<XOR<AmbitionsUpdateToOneWithWhereWithoutTasksInput, AmbitionsUpdateWithoutTasksInput>, AmbitionsUncheckedUpdateWithoutTasksInput>
  }

  export type AmbitionsCreateNestedOneWithoutMilestonesInput = {
    create?: XOR<AmbitionsCreateWithoutMilestonesInput, AmbitionsUncheckedCreateWithoutMilestonesInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutMilestonesInput
    connect?: AmbitionsWhereUniqueInput
  }

  export type AmbitionsUpdateOneWithoutMilestonesNestedInput = {
    create?: XOR<AmbitionsCreateWithoutMilestonesInput, AmbitionsUncheckedCreateWithoutMilestonesInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutMilestonesInput
    upsert?: AmbitionsUpsertWithoutMilestonesInput
    disconnect?: AmbitionsWhereInput | boolean
    delete?: AmbitionsWhereInput | boolean
    connect?: AmbitionsWhereUniqueInput
    update?: XOR<XOR<AmbitionsUpdateToOneWithWhereWithoutMilestonesInput, AmbitionsUpdateWithoutMilestonesInput>, AmbitionsUncheckedUpdateWithoutMilestonesInput>
  }

  export type AmbitionsCreateNestedOneWithoutNotesInput = {
    create?: XOR<AmbitionsCreateWithoutNotesInput, AmbitionsUncheckedCreateWithoutNotesInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutNotesInput
    connect?: AmbitionsWhereUniqueInput
  }

  export type AmbitionsUpdateOneWithoutNotesNestedInput = {
    create?: XOR<AmbitionsCreateWithoutNotesInput, AmbitionsUncheckedCreateWithoutNotesInput>
    connectOrCreate?: AmbitionsCreateOrConnectWithoutNotesInput
    upsert?: AmbitionsUpsertWithoutNotesInput
    disconnect?: AmbitionsWhereInput | boolean
    delete?: AmbitionsWhereInput | boolean
    connect?: AmbitionsWhereUniqueInput
    update?: XOR<XOR<AmbitionsUpdateToOneWithWhereWithoutNotesInput, AmbitionsUpdateWithoutNotesInput>, AmbitionsUncheckedUpdateWithoutNotesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type NestedEnumTrackingMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingMethod | EnumTrackingMethodFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingMethodFilter<$PrismaModel> | $Enums.TrackingMethod
  }

  export type NestedEnumAmbitionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbitionStatus | EnumAmbitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbitionStatusFilter<$PrismaModel> | $Enums.AmbitionStatus
  }

  export type NestedEnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type NestedEnumTrackingMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingMethod | EnumTrackingMethodFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingMethod[] | ListEnumTrackingMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingMethodWithAggregatesFilter<$PrismaModel> | $Enums.TrackingMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingMethodFilter<$PrismaModel>
    _max?: NestedEnumTrackingMethodFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAmbitionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbitionStatus | EnumAmbitionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbitionStatus[] | ListEnumAmbitionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbitionStatusWithAggregatesFilter<$PrismaModel> | $Enums.AmbitionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAmbitionStatusFilter<$PrismaModel>
    _max?: NestedEnumAmbitionStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AmbitionsCreateWithoutUserInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: AmbitionTasksCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: AmbitionTasksUncheckedCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesUncheckedCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesUncheckedCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsCreateOrConnectWithoutUserInput = {
    where: AmbitionsWhereUniqueInput
    create: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput>
  }

  export type AmbitionsCreateManyUserInputEnvelope = {
    data: AmbitionsCreateManyUserInput | AmbitionsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AmbitionsUpsertWithWhereUniqueWithoutUserInput = {
    where: AmbitionsWhereUniqueInput
    update: XOR<AmbitionsUpdateWithoutUserInput, AmbitionsUncheckedUpdateWithoutUserInput>
    create: XOR<AmbitionsCreateWithoutUserInput, AmbitionsUncheckedCreateWithoutUserInput>
  }

  export type AmbitionsUpdateWithWhereUniqueWithoutUserInput = {
    where: AmbitionsWhereUniqueInput
    data: XOR<AmbitionsUpdateWithoutUserInput, AmbitionsUncheckedUpdateWithoutUserInput>
  }

  export type AmbitionsUpdateManyWithWhereWithoutUserInput = {
    where: AmbitionsScalarWhereInput
    data: XOR<AmbitionsUpdateManyMutationInput, AmbitionsUncheckedUpdateManyWithoutUserInput>
  }

  export type AmbitionsScalarWhereInput = {
    AND?: AmbitionsScalarWhereInput | AmbitionsScalarWhereInput[]
    OR?: AmbitionsScalarWhereInput[]
    NOT?: AmbitionsScalarWhereInput | AmbitionsScalarWhereInput[]
    id?: StringFilter<"Ambitions"> | string
    userId?: StringFilter<"Ambitions"> | string
    title?: StringFilter<"Ambitions"> | string
    description?: StringFilter<"Ambitions"> | string
    category?: StringFilter<"Ambitions"> | string
    priority?: EnumPriorityFilter<"Ambitions"> | $Enums.Priority
    deadline?: DateTimeFilter<"Ambitions"> | Date | string
    themeColor?: StringFilter<"Ambitions"> | string
    trackingMethod?: EnumTrackingMethodFilter<"Ambitions"> | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingEnd?: DateTimeFilter<"Ambitions"> | Date | string
    timeTrackingDuration?: IntFilter<"Ambitions"> | number
    timeTrackingUnit?: StringFilter<"Ambitions"> | string
    timeTrackingStatus?: StringFilter<"Ambitions"> | string
    status?: EnumAmbitionStatusFilter<"Ambitions"> | $Enums.AmbitionStatus
    createdAt?: DateTimeFilter<"Ambitions"> | Date | string
    updatedAt?: DateTimeFilter<"Ambitions"> | Date | string
  }

  export type UserCreateWithoutAmbitionsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutAmbitionsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutAmbitionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAmbitionsInput, UserUncheckedCreateWithoutAmbitionsInput>
  }

  export type AmbitionTasksCreateWithoutAmbitionInput = {
    id?: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionTasksUncheckedCreateWithoutAmbitionInput = {
    id?: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionTasksCreateOrConnectWithoutAmbitionInput = {
    where: AmbitionTasksWhereUniqueInput
    create: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput>
  }

  export type AmbitionTasksCreateManyAmbitionInputEnvelope = {
    data: AmbitionTasksCreateManyAmbitionInput | AmbitionTasksCreateManyAmbitionInput[]
    skipDuplicates?: boolean
  }

  export type AmbitionMilestonesCreateWithoutAmbitionsInput = {
    id?: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput = {
    id?: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionMilestonesCreateOrConnectWithoutAmbitionsInput = {
    where: AmbitionMilestonesWhereUniqueInput
    create: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput>
  }

  export type AmbitionMilestonesCreateManyAmbitionsInputEnvelope = {
    data: AmbitionMilestonesCreateManyAmbitionsInput | AmbitionMilestonesCreateManyAmbitionsInput[]
    skipDuplicates?: boolean
  }

  export type AmbitionNotesCreateWithoutAmbitionsInput = {
    id?: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionNotesUncheckedCreateWithoutAmbitionsInput = {
    id?: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionNotesCreateOrConnectWithoutAmbitionsInput = {
    where: AmbitionNotesWhereUniqueInput
    create: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput>
  }

  export type AmbitionNotesCreateManyAmbitionsInputEnvelope = {
    data: AmbitionNotesCreateManyAmbitionsInput | AmbitionNotesCreateManyAmbitionsInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAmbitionsInput = {
    update: XOR<UserUpdateWithoutAmbitionsInput, UserUncheckedUpdateWithoutAmbitionsInput>
    create: XOR<UserCreateWithoutAmbitionsInput, UserUncheckedCreateWithoutAmbitionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAmbitionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAmbitionsInput, UserUncheckedUpdateWithoutAmbitionsInput>
  }

  export type UserUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksUpsertWithWhereUniqueWithoutAmbitionInput = {
    where: AmbitionTasksWhereUniqueInput
    update: XOR<AmbitionTasksUpdateWithoutAmbitionInput, AmbitionTasksUncheckedUpdateWithoutAmbitionInput>
    create: XOR<AmbitionTasksCreateWithoutAmbitionInput, AmbitionTasksUncheckedCreateWithoutAmbitionInput>
  }

  export type AmbitionTasksUpdateWithWhereUniqueWithoutAmbitionInput = {
    where: AmbitionTasksWhereUniqueInput
    data: XOR<AmbitionTasksUpdateWithoutAmbitionInput, AmbitionTasksUncheckedUpdateWithoutAmbitionInput>
  }

  export type AmbitionTasksUpdateManyWithWhereWithoutAmbitionInput = {
    where: AmbitionTasksScalarWhereInput
    data: XOR<AmbitionTasksUpdateManyMutationInput, AmbitionTasksUncheckedUpdateManyWithoutAmbitionInput>
  }

  export type AmbitionTasksScalarWhereInput = {
    AND?: AmbitionTasksScalarWhereInput | AmbitionTasksScalarWhereInput[]
    OR?: AmbitionTasksScalarWhereInput[]
    NOT?: AmbitionTasksScalarWhereInput | AmbitionTasksScalarWhereInput[]
    id?: StringFilter<"AmbitionTasks"> | string
    ambitionId?: StringFilter<"AmbitionTasks"> | string
    task?: StringFilter<"AmbitionTasks"> | string
    description?: StringFilter<"AmbitionTasks"> | string
    completed?: BoolFilter<"AmbitionTasks"> | boolean
    deadline?: DateTimeFilter<"AmbitionTasks"> | Date | string
    createdAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionTasks"> | Date | string
  }

  export type AmbitionMilestonesUpsertWithWhereUniqueWithoutAmbitionsInput = {
    where: AmbitionMilestonesWhereUniqueInput
    update: XOR<AmbitionMilestonesUpdateWithoutAmbitionsInput, AmbitionMilestonesUncheckedUpdateWithoutAmbitionsInput>
    create: XOR<AmbitionMilestonesCreateWithoutAmbitionsInput, AmbitionMilestonesUncheckedCreateWithoutAmbitionsInput>
  }

  export type AmbitionMilestonesUpdateWithWhereUniqueWithoutAmbitionsInput = {
    where: AmbitionMilestonesWhereUniqueInput
    data: XOR<AmbitionMilestonesUpdateWithoutAmbitionsInput, AmbitionMilestonesUncheckedUpdateWithoutAmbitionsInput>
  }

  export type AmbitionMilestonesUpdateManyWithWhereWithoutAmbitionsInput = {
    where: AmbitionMilestonesScalarWhereInput
    data: XOR<AmbitionMilestonesUpdateManyMutationInput, AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsInput>
  }

  export type AmbitionMilestonesScalarWhereInput = {
    AND?: AmbitionMilestonesScalarWhereInput | AmbitionMilestonesScalarWhereInput[]
    OR?: AmbitionMilestonesScalarWhereInput[]
    NOT?: AmbitionMilestonesScalarWhereInput | AmbitionMilestonesScalarWhereInput[]
    id?: StringFilter<"AmbitionMilestones"> | string
    ambitionId?: StringFilter<"AmbitionMilestones"> | string
    milestone?: StringFilter<"AmbitionMilestones"> | string
    description?: StringFilter<"AmbitionMilestones"> | string
    completed?: BoolFilter<"AmbitionMilestones"> | boolean
    createdAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionMilestones"> | Date | string
  }

  export type AmbitionNotesUpsertWithWhereUniqueWithoutAmbitionsInput = {
    where: AmbitionNotesWhereUniqueInput
    update: XOR<AmbitionNotesUpdateWithoutAmbitionsInput, AmbitionNotesUncheckedUpdateWithoutAmbitionsInput>
    create: XOR<AmbitionNotesCreateWithoutAmbitionsInput, AmbitionNotesUncheckedCreateWithoutAmbitionsInput>
  }

  export type AmbitionNotesUpdateWithWhereUniqueWithoutAmbitionsInput = {
    where: AmbitionNotesWhereUniqueInput
    data: XOR<AmbitionNotesUpdateWithoutAmbitionsInput, AmbitionNotesUncheckedUpdateWithoutAmbitionsInput>
  }

  export type AmbitionNotesUpdateManyWithWhereWithoutAmbitionsInput = {
    where: AmbitionNotesScalarWhereInput
    data: XOR<AmbitionNotesUpdateManyMutationInput, AmbitionNotesUncheckedUpdateManyWithoutAmbitionsInput>
  }

  export type AmbitionNotesScalarWhereInput = {
    AND?: AmbitionNotesScalarWhereInput | AmbitionNotesScalarWhereInput[]
    OR?: AmbitionNotesScalarWhereInput[]
    NOT?: AmbitionNotesScalarWhereInput | AmbitionNotesScalarWhereInput[]
    id?: StringFilter<"AmbitionNotes"> | string
    ambitionId?: StringFilter<"AmbitionNotes"> | string
    note?: StringFilter<"AmbitionNotes"> | string
    createdAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
    updatedAt?: DateTimeFilter<"AmbitionNotes"> | Date | string
  }

  export type AmbitionsCreateWithoutTasksInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAmbitionsInput
    milestones?: AmbitionMilestonesCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUncheckedCreateWithoutTasksInput = {
    id?: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    milestones?: AmbitionMilestonesUncheckedCreateNestedManyWithoutAmbitionsInput
    notes?: AmbitionNotesUncheckedCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsCreateOrConnectWithoutTasksInput = {
    where: AmbitionsWhereUniqueInput
    create: XOR<AmbitionsCreateWithoutTasksInput, AmbitionsUncheckedCreateWithoutTasksInput>
  }

  export type AmbitionsUpsertWithoutTasksInput = {
    update: XOR<AmbitionsUpdateWithoutTasksInput, AmbitionsUncheckedUpdateWithoutTasksInput>
    create: XOR<AmbitionsCreateWithoutTasksInput, AmbitionsUncheckedCreateWithoutTasksInput>
    where?: AmbitionsWhereInput
  }

  export type AmbitionsUpdateToOneWithWhereWithoutTasksInput = {
    where?: AmbitionsWhereInput
    data: XOR<AmbitionsUpdateWithoutTasksInput, AmbitionsUncheckedUpdateWithoutTasksInput>
  }

  export type AmbitionsUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAmbitionsNestedInput
    milestones?: AmbitionMilestonesUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    milestones?: AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUncheckedUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsCreateWithoutMilestonesInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAmbitionsInput
    tasks?: AmbitionTasksCreateNestedManyWithoutAmbitionInput
    notes?: AmbitionNotesCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUncheckedCreateWithoutMilestonesInput = {
    id?: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: AmbitionTasksUncheckedCreateNestedManyWithoutAmbitionInput
    notes?: AmbitionNotesUncheckedCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsCreateOrConnectWithoutMilestonesInput = {
    where: AmbitionsWhereUniqueInput
    create: XOR<AmbitionsCreateWithoutMilestonesInput, AmbitionsUncheckedCreateWithoutMilestonesInput>
  }

  export type AmbitionsUpsertWithoutMilestonesInput = {
    update: XOR<AmbitionsUpdateWithoutMilestonesInput, AmbitionsUncheckedUpdateWithoutMilestonesInput>
    create: XOR<AmbitionsCreateWithoutMilestonesInput, AmbitionsUncheckedCreateWithoutMilestonesInput>
    where?: AmbitionsWhereInput
  }

  export type AmbitionsUpdateToOneWithWhereWithoutMilestonesInput = {
    where?: AmbitionsWhereInput
    data: XOR<AmbitionsUpdateWithoutMilestonesInput, AmbitionsUncheckedUpdateWithoutMilestonesInput>
  }

  export type AmbitionsUpdateWithoutMilestonesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAmbitionsNestedInput
    tasks?: AmbitionTasksUpdateManyWithoutAmbitionNestedInput
    notes?: AmbitionNotesUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateWithoutMilestonesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: AmbitionTasksUncheckedUpdateManyWithoutAmbitionNestedInput
    notes?: AmbitionNotesUncheckedUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsCreateWithoutNotesInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAmbitionsInput
    tasks?: AmbitionTasksCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsUncheckedCreateWithoutNotesInput = {
    id?: string
    userId: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: AmbitionTasksUncheckedCreateNestedManyWithoutAmbitionInput
    milestones?: AmbitionMilestonesUncheckedCreateNestedManyWithoutAmbitionsInput
  }

  export type AmbitionsCreateOrConnectWithoutNotesInput = {
    where: AmbitionsWhereUniqueInput
    create: XOR<AmbitionsCreateWithoutNotesInput, AmbitionsUncheckedCreateWithoutNotesInput>
  }

  export type AmbitionsUpsertWithoutNotesInput = {
    update: XOR<AmbitionsUpdateWithoutNotesInput, AmbitionsUncheckedUpdateWithoutNotesInput>
    create: XOR<AmbitionsCreateWithoutNotesInput, AmbitionsUncheckedCreateWithoutNotesInput>
    where?: AmbitionsWhereInput
  }

  export type AmbitionsUpdateToOneWithWhereWithoutNotesInput = {
    where?: AmbitionsWhereInput
    data: XOR<AmbitionsUpdateWithoutNotesInput, AmbitionsUncheckedUpdateWithoutNotesInput>
  }

  export type AmbitionsUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAmbitionsNestedInput
    tasks?: AmbitionTasksUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: AmbitionTasksUncheckedUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsCreateManyUserInput = {
    id?: string
    title: string
    description: string
    category: string
    priority: $Enums.Priority
    deadline: Date | string
    themeColor: string
    trackingMethod: $Enums.TrackingMethod
    timeTrackingStart: Date | string
    timeTrackingEnd: Date | string
    timeTrackingDuration: number
    timeTrackingUnit: string
    timeTrackingStatus: string
    status: $Enums.AmbitionStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: AmbitionTasksUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: AmbitionTasksUncheckedUpdateManyWithoutAmbitionNestedInput
    milestones?: AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsNestedInput
    notes?: AmbitionNotesUncheckedUpdateManyWithoutAmbitionsNestedInput
  }

  export type AmbitionsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    themeColor?: StringFieldUpdateOperationsInput | string
    trackingMethod?: EnumTrackingMethodFieldUpdateOperationsInput | $Enums.TrackingMethod
    timeTrackingStart?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    timeTrackingDuration?: IntFieldUpdateOperationsInput | number
    timeTrackingUnit?: StringFieldUpdateOperationsInput | string
    timeTrackingStatus?: StringFieldUpdateOperationsInput | string
    status?: EnumAmbitionStatusFieldUpdateOperationsInput | $Enums.AmbitionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksCreateManyAmbitionInput = {
    id?: string
    task: string
    description: string
    completed: boolean
    deadline: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionMilestonesCreateManyAmbitionsInput = {
    id?: string
    milestone: string
    description: string
    completed: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionNotesCreateManyAmbitionsInput = {
    id?: string
    note: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmbitionTasksUpdateWithoutAmbitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksUncheckedUpdateWithoutAmbitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionTasksUncheckedUpdateManyWithoutAmbitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesUncheckedUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionMilestonesUncheckedUpdateManyWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestone?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesUncheckedUpdateWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbitionNotesUncheckedUpdateManyWithoutAmbitionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}