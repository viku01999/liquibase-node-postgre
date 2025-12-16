# Liquibase with PostgreSQL on Ubuntu Node js typescript
**Beginner → Advanced Guide**

## 1. What is Liquibase?
**Liquibase** is an open-source database version control and migration tool.  
It allows you to **track, manage, and deploy database schema changes** in a structured and safe way.  

*(For now, just focus on PostgreSQL. Integration with a backend project will be explained at the end.)*

- Tracks database changes in files (XML / YAML / SQL / JSON)
- Applies changes incrementally
- Supports rollback
- Works well with CI/CD

## 2. Prerequisites & installation (Ubuntu)
### 2.1 Java (Required)
Liquibase runs on Java.

wget https://www.oracle.com/in/java/technologies/downloads/#java21

### 2.2 Install postgres server
visit https://www.postgresql.org/download/linux/ubuntu/

### 2.3 I am uing ubuntu 25 vsersion
I am uing ubuntu 25 you can do same for ubuntu 24

### 2.4 For DB visualization install pg admin4
Install pg admin4
visit https://www.pgadmin.org/download/pgadmin-4-apt/

### 2.5 PostgreSQL JDBC Driver (VERY IMPORTANT)
visit https://jdbc.postgresql.org/download/

### 2.6 Install liquibase
visit https://docs.liquibase.com/pro/get-started-4-33/install-liquibase-on-linux-with-debian-or-ubuntu

**Installation dir**
```bash
# Dir
/opt/liquibase

# Check version
liquibase -v
```

## 3. Liquibase Components and Usage
### 3.1 ChangeLog
- **Definition:** The master file that defines all database changes.
- **File types:** XML, YAML, JSON, or SQL.
- **Purpose:** Entry point for Liquibase to know which changes to apply.
- **Usage:**
```xml
<databaseChangeLog>
    <include file="001-init-schema.xml"/>
</databaseChangeLog>
```
### 3.2 ChangeSet
- **Definition:** A single unit of change (like a transaction) in a ChangeLog.
- **Attributes:**
  - **id:** Unique identifier
  - **author:** Name of the author
- **Purpose:** Groups specific database changes to be applied together.
- **Usage:**
```xml
<changeSet id="v1-init" author="vikas">
    <createTable tableName="users">
        <column name="id" type="UUID" />
    </createTable>
</changeSet>
```

### 3.3 Changes
- **Definition:** Individual database modifications inside a ChangeSet.
- **Types of changes:**
  - **createTable**
  - **addColumn**
  - **dropTable**
  - **modifyDataType**
  - **insert**
- **Purpose:** Specifies what exactly to do in the database.
- **Usage example:**
```xml
<changeSet id="v1-add-users" author="vikas">
    <createTable tableName="users">
        <column name="id" type="UUID"/>
        <column name="name" type="VARCHAR(255)"/>
    </createTable>
    <addColumn tableName="users">
        <column name="email" type="VARCHAR(255)"/>
    </addColumn>
</changeSet>
```

### 3.4 Rollback
- **Definition:** Instructions to undo a ChangeSet.
- **Purpose:** Allows reversing database changes in case of errors or deployment issues.
- **Usage:** Can be specific SQL commands or Liquibase changes.
- **Example:**
```xml
<changeSet id="v1-init" author="vikas">
    <createTable tableName="users">
        <column name="id" type="UUID"/>
    </createTable>
    <rollback>
        <dropTable tableName="users"/>
    </rollback>
</changeSet>
```

### 3.5 Preconditions
- **Definition:** Conditions that must be true for a ChangeSet to run.
- **Purpose:** Avoids errors if the database state is unexpected.
- **Usage example:**
```xml
<changeSet id="v1-init" author="vikas">
    <preConditions onFail="MARK_RAN">
        <tableExists tableName="users"/>
    </preConditions>
    <createTable tableName="users">
        <column name="id" type="UUID"/>
    </createTable>
</changeSet>
```

### 3.6 Tags
- **Definition:** Named points in the database history.
- **Purpose:** Allows rollback or tracking of specific releases.
- **Usage examples:**
```bash
# Tag the current database state
liquibase tag v1

# Rollback to a specific tag
liquibase rollback v1
```

### 3.7 Contexts
- **Definition:** Allows running specific ChangeSets based on the environment (e.g., dev, test, prod).
- **Purpose:** Enables environment-specific database changes.
- **Usage example:**
```xml
<changeSet id="v1" author="vikas" context="dev">
    <createTable tableName="dev_table"/>
</changeSet>
```
- **Command to apply changes for a specific context:**
```bash
liquibase update --contexts=dev
```

### 3.8 DATABASECHANGELOG Table
- **Definition:** Internal table where Liquibase stores executed ChangeSets.
- **Purpose:** Tracks which ChangeSets have been applied to the database.
- **Important columns:**
  - **id:** ChangeSet identifier
  - **author:** ChangeSet author
  - **filename:** File containing the ChangeSet
  - **dateexecuted:** Timestamp when the ChangeSet was applied
  - **md5sum:** Checksum to detect changes in the ChangeSet

### 3.9 DATABASECHANGELOGLOCK Table
- **Definition:** Prevents multiple Liquibase processes from updating the database at the same time.
- **Purpose:** Ensures atomic execution of database migrations and avoids conflicts.
- **Notes:** This table typically has a single row that indicates whether the database is locked.

### 3.10 Liquibase CLI / Commands
- **Definition:** Tool to execute, rollback, and manage database changes.
- **Purpose:** Provides a command-line interface to control database migrations.
- **Common commands:**
  - **update:** Apply pending ChangeSets
  - **rollback:** Rollback ChangeSets
  - **history:** View executed ChangeSets
  - **status:** Check pending ChangeSets
  - **tag:** Label the current database state
- **Usage examples:**
```bash
# Apply pending changes
liquibase update

# Rollback to a specific tag
liquibase rollback v1

# View executed ChangeSets
liquibase history

# Check pending ChangeSets
liquibase status

# Tag the current database state
liquibase tag v1
```

### 3.11 Liquibase CLI / Commands
- **Definition:** Tool to execute, rollback, and manage database changes.
- **Purpose:** Provides a command-line interface to control database migrations.
- **Common commands:**
  - **update:** Apply pending ChangeSets
  - **rollback:** Rollback ChangeSets
  - **history:** View executed ChangeSets
  - **status:** Check pending ChangeSets
  - **tag:** Label the current database state
- **Usage examples:**
```bash
# Apply pending changes
liquibase update

# Rollback to a specific tag
liquibase rollback v1

# View executed ChangeSets
liquibase history

# Check pending ChangeSets
liquibase status

# Tag the current database state
liquibase tag v1
```

## 4. Let's create a project for Liquibase

Here’s a visual overview of the project structure:  

![Liquibase Project Structure](/media/folderStructure.png)

### 4.1 Project Directory Structure
```bash
liquibase/
├── changelog/
│   ├── db.changelog-master.xml
├── lib/
│   └── postgresql-42.7.8.jar
└── liquibase.properties
```

### 4.2 First implementation
**liquibase.properties**
```bash
# JDBC connection info
url=jdbc:postgresql://localhost:5432/postgres
username=postgres
password=postgres
driver=org.postgresql.Driver

# ChangeLog file (path relative to current folder)
changeLogFile=changelog/db.changelog-master.xml

# Logging level
logLevel=info

# Classpath to JDBC driver
classpath=lib/postgresql-42.7.8.jar
```

**db.changelog-master.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

  <!-- Initial schema here -->

</databaseChangeLog>
```
**Now move into dir -> (liquibase) and run**
```bash
cd liquibase

# Run the command given below for Apply all pending changesets
liquibase update
```
*See the output into postgres DB (I am using pg admin)*

![first time run db](/media/db1.png)

### 4.3 First Changeset – Initial Schema Creation (Version 1)
**001-init-schema.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog https://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

  <changeSet id="v1-init" author="vikas">

    <!-- Users table -->
    <createTable tableName="users">
      <column name="id" type="UUID">
        <constraints primaryKey="true" nullable="false" />
      </column>
      <column name="username" type="TEXT" />
      <column name="password" type="TEXT" />
      <column name="created_at"
        type="TIMESTAMP"
        defaultValueComputed="NOW()" />
    </createTable>

    <!-- Profiles table -->
    <createTable tableName="profiles">
      <column name="id" type="UUID">
        <constraints primaryKey="true" nullable="false" />
      </column>
      <column name="full_name" type="TEXT" />
      <column name="user_id" type="UUID" />
    </createTable>

    <!-- User audit table -->
    <createTable tableName="user_audit">
      <column name="id" type="UUID">
        <constraints primaryKey="true" nullable="false" />
      </column>
      <column name="action" type="TEXT" />
      <column name="created_at"
        type="TIMESTAMP"
        defaultValueComputed="NOW()" />
    </createTable>

    <!-- Rollback instructions -->
    <rollback>
      <dropTable tableName="user_audit" />
      <dropTable tableName="profiles" />
      <dropTable tableName="users" />
    </rollback>

  </changeSet>

</databaseChangeLog>
```

**Update the Master Changelog**
```xml
<include file="001-init-schema.xml" relativeToChangelogFile="true"/>
```

**Folder structure before update**

![Folder structure for v1](/media/folder_structure_v1.png)

**Apply this changeset**
```bash
liquibase update
```

**What This Changeset Does**

- users table – stores user login info.

- profiles table – stores user profile details.

- user_audit table – logs user actions.

Rollback – drops the three tables in reverse order. This allows undoing the changes applied by this changeset.

Liquibase will automatically create a table called **DATABASECHANGELOG** in your DB to track this changeset.

**Verify in Database**
- Check users, profiles, and user_audit tables in your DB (using pgAdmin or psql).

- Check the DATABASECHANGELOG table to confirm the changeset was applied.

**View Change Log History**
```bash
liquibase history
```
Example Output:
![Changelog history](/media/first_changelog.png)

**Rollback Example**
```bash
# If you want to rollback a specific ChangeSet ID, you need to use the rollback command with --changeSetId, --changeSetAuthor, and --changeSetPath together—Liquibase needs all three to uniquely identify it.
liquibase rollback --changeSetId=v1-init --changeSetAuthor=vikas --changeSetPath=changelog.xml

# Or using count from bottom in the history last one will be 1
# Descending order
liquibase rollbackCount 1
```

**Summary**
```table
| Action                     | Command                     | Effect                                          |
| -------------------------- | --------------------------- | ----------------------------------------------- |
| Check applied changesets   | `liquibase history`         | Shows all applied changesets in order           |
| Rollback last changeset    | `liquibase rollbackCount 1` | Reverts the most recent changeset               |
| Rollback last N changesets | `liquibase rollbackCount N` | Reverts the last N changesets, in reverse order |
```

**This ensures that:**
- The most recent changeset is always rolled back first.
- You can safely rollback any number of recent changesets step by step.

**Affect into DB**
![After applying v1](/media/db2.png)

### 4.4 Second Changeset - Add email column into users (version 2)
- **Purpose:** Add a new column `email` to the existing `users` table.  
- **ChangeSet ID:** `v2-add-email`  
- **Author:** `vikas`  
- **Database Impact:** Alters `users` table by adding a new column.  
- **Rollback:** Removes the `email` column if the ChangeSet is rolled back.  

**002-add-email-to-user.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                        https://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

    <changeSet id="v2-add-email" author="vikas">
        <addColumn tableName="users">
            <column name="email" type="TEXT"/>
        </addColumn>

        <rollback>
            <dropColumn tableName="users" columnName="email"/>
        </rollback>
    </changeSet>

</databaseChangeLog>
```
**Update the Master Changelog**
```xml
<include file="002-add-email-to-user.xml" relativeToChangelogFile="true"/>
```

**Folder structure before update**

![Folder structure for v1](/media/folder_structure_v2.png)

**Apply changes**
``` bash
# Apply the second changeset
liquibase update

# To see history
liquibase history

# Rollback the second changeset (If necessary)
liquibase rollbackCount 1
```

**Affect into DB**
![After applying v1](/media/db3.png)


### 4.5 Third Changeset - Add status column into users (version 3)
- **Purpose:** Add a new column `status` to the existing `users` table with a default value.  
- **ChangeSet ID:** `v3-add-status`  
- **Author:** `vikas`  
- **Database Impact:** Alters `users` table by adding a `status` column with default value `ACTIVE`.  
- **Rollback:** Removes the `status` column if the ChangeSet is rolled back.  

**003-add-status-to-user.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                        https://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

    <changeSet id="v3-add-status" author="vikas">
        <addColumn tableName="users">
            <column name="status" type="TEXT" defaultValue="ACTIVE"/>
        </addColumn>

        <rollback>
            <dropColumn tableName="users" columnName="status"/>
        </rollback>
    </changeSet>

</databaseChangeLog>

**Update the Master Changelog**
```xml
<include file="002-add-email-to-user.xml" relativeToChangelogFile="true"/>
```

**Update the Master Changelog**

<include file="003-add-status-to-user.xml" relativeToChangelogFile="true"/>

**Folder structure before update**

![Folder structure for v1](/media/folder_structure_v3.png)

**Apply changes**
``` bash
# Apply the second changeset
liquibase update

# To see history
liquibase history

# Rollback the second changeset (If necessary)
liquibase rollbackCount 1
```

**Affect into DB**
![After applying v1](/media/db4.png)

**After successfully completing all steps, the final `db.changelog-master.xml` will look like the following.**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

  <!-- Initial schema here -->
  <include file="001-init-schema.xml" relativeToChangelogFile="true" />
  <include file="002-add-email-to-user.xml" relativeToChangelogFile="true" />
  <include file="003-add-status-to-user.xml" relativeToChangelogFile="true"/>

</databaseChangeLog>
```
> **Note:** In every ChangeSet XML, a `<rollback>` tag has already been implemented.  
> If you want to rollback a specific ChangeSet, run the following Liquibase command.  
> Liquibase will automatically execute the corresponding `<rollback>` logic defined inside the ChangeSet.

```bash
liquibase rollback \
  --changeSetId=v3-add-status \
  --changeSetAuthor=vikas \
  --changeSetPath=003-add-status-to-user.xml
```


## Summary & Next Steps

### ✅ What We Have Completed So Far
So far, we have successfully covered the core and practical aspects of Liquibase, including:

- Understanding Liquibase core components:
  - ChangeLog
  - ChangeSet
  - Changes
  - Rollback
  - Preconditions
  - Contexts
  - Tags
- Creating a Liquibase project from scratch
- Setting up a master changelog (`db.changelog-master.xml`)
- Implementing versioned ChangeSets:
  - **v1:** Initial schema creation
  - **v2:** Adding `email` column to `users` table
  - **v3:** Adding `status` column with default value
- Implementing proper `<rollback>` logic in every ChangeSet
- Applying changes using Liquibase CLI
- Rolling back:
  - By count
  - By tag
  - By specific ChangeSet
- Tracking changes using `DATABASECHANGELOG` and `DATABASECHANGELOGLOCK` tables
- Verifying database state using `history` and `status` commands

---

### 🚀 What You Need to Learn Next to Become Pro in Liquibase
To become proficient and production-ready with Liquibase, the following topics should be covered next:

- Advanced ChangeSets:
  - Indexes and constraints
  - Foreign keys
  - Unique constraints
  - Sequences
- Data migrations:
  - `insert`, `update`, and `loadData`
- Managing multiple environments:
  - Contexts and labels (advanced usage)
  - Environment-specific changelogs
- Handling large teams:
  - ChangeSet naming conventions
  - Conflict resolution strategies
- Best practices:
  - Immutable ChangeSets
  - Using tags for releases
  - Structuring changelog files
- CI/CD integration:
  - Liquibase with Jenkins / GitHub Actions
  - Automating migrations
- Database-specific considerations:
  - PostgreSQL vs MySQL vs Oracle differences
- Performance and troubleshooting:
  - Handling checksum changes
  - Fixing failed or locked deployments
- Security:
  - Using Liquibase with secrets and vaults

---

### 📞 Need Help or Have Questions?
If you face any issues or have queries, feel free to connect with me on **LinkedIn**:

👉 [Connect with me on LinkedIn](www.linkedin.com/in/vikas-kumar-10b8822a9)


> _Let’s keep learning and improving database version control with Liquibase._

## At this stage, you can create a backend project using any modern technology stack, such as
**Node.js**, **Java (Spring Boot)**, **Python**, or other backend frameworks.
You can use any ORM or database access tool like **TypeORM**, **Hibernate**, **Prisma**, **JPA**,
or even plain SQL.

Connect the application to the same database managed by **Liquibase** and verify that
your backend project works correctly with the migrated database schema.
