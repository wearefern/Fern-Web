-- CreateTable
CREATE TABLE "users" (
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "contents" (
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "content_interactions" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "likes" SMALLINT NOT NULL DEFAULT 0,
    "user_hash" TEXT NOT NULL,
    "content_slug" TEXT NOT NULL,

    CONSTRAINT "content_interactions_pkey" PRIMARY KEY ("user_hash","content_slug")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" TEXT NOT NULL,
    "orderConfirmations" BOOLEAN NOT NULL DEFAULT true,
    "downloadUpdates" BOOLEAN NOT NULL DEFAULT false,
    "productAnnouncements" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "billing_profiles" (
    "user_id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "billingEmail" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "addressLine1" TEXT NOT NULL DEFAULT '',
    "addressLine2" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_hash_key" ON "users"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "contents_slug_key" ON "contents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_profiles_user_id_key" ON "billing_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "content_interactions" ADD CONSTRAINT "content_interactions_user_hash_fkey" FOREIGN KEY ("user_hash") REFERENCES "users"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_interactions" ADD CONSTRAINT "content_interactions_content_slug_fkey" FOREIGN KEY ("content_slug") REFERENCES "contents"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
