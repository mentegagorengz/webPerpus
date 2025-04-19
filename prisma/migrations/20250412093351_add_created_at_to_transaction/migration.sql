-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isbn" TEXT,
    "imageUrl" TEXT,
    "additionalAuthors" TEXT,
    "availability" INTEGER NOT NULL,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "bibliography" TEXT,
    "category" TEXT,
    "classificationNumber" TEXT,
    "condition" TEXT DEFAULT 'Baik',
    "description" TEXT,
    "digitalContent" TEXT,
    "edition" TEXT,
    "generalNotes" TEXT,
    "language" TEXT,
    "location" TEXT,
    "mainAuthor" TEXT,
    "publisher" TEXT,
    "subject" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Majalah" (
    "id" SERIAL NOT NULL,
    "issn" TEXT,
    "code" TEXT,
    "language" TEXT,
    "city" TEXT,
    "year" TEXT,
    "frequency" TEXT,
    "type" TEXT,
    "subject" TEXT,
    "publisher" TEXT,
    "edition" TEXT,
    "volume" TEXT,
    "availability" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Majalah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penelitian" (
    "id" SERIAL NOT NULL,
    "no_ddc" TEXT,
    "main_author" TEXT,
    "additional_author" TEXT,
    "additional_author_conference" TEXT,
    "additional_author_person" TEXT,
    "physical_description" TEXT,
    "type" TEXT,
    "keywords" TEXT,
    "language" TEXT,
    "bibliography" TEXT,
    "publisher" TEXT,
    "body" TEXT,
    "additional_body" TEXT,
    "digital_content" TEXT,
    "inventory_number" TEXT,
    "provider" TEXT,
    "location" TEXT,
    "availability" TEXT,

    CONSTRAINT "Penelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "borrowDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "overdueDays" INTEGER,
    "fine" INTEGER,
    "qrCode" TEXT,
    "pickupAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "faculty" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
