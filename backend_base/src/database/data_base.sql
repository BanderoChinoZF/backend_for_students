-- =====================================================================
-- POS / Catálogo de productos - Esquema inicial (PostgreSQL)
-- Módulos: roles, empleados, usuarios, categorías, productos
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Función genérica para mantener updated_at
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id           SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    description  VARCHAR(255),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_roles_name UNIQUE (name)
);

INSERT INTO roles (name, description) VALUES
    ('admin',      'Acceso total al sistema'),
    ('gerente',    'Gestión de productos, empleados y reportes'),
    ('cajero',     'Operación de ventas en caja'),
    ('almacenista','Gestión de inventario y catálogo');

-- ---------------------------------------------------------------------
-- EMPLEADOS (datos de la persona; no todos requieren acceso al sistema)
-- ---------------------------------------------------------------------
CREATE TABLE employees (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_code    VARCHAR(20)  NOT NULL,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255),
    phone            VARCHAR(30),
    address          VARCHAR(255),
    birth_date       DATE,
    job_title        VARCHAR(100),
    hire_date        DATE         NOT NULL DEFAULT CURRENT_DATE,
    termination_date DATE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_employees_code UNIQUE (employee_code),
    CONSTRAINT ck_employees_dates
        CHECK (termination_date IS NULL OR termination_date >= hire_date)
);

CREATE UNIQUE INDEX uq_employees_email
    ON employees (LOWER(email)) WHERE email IS NOT NULL;
CREATE INDEX idx_employees_name ON employees (last_name, first_name);

CREATE TRIGGER trg_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- USUARIOS (credenciales de acceso, 1 a 1 con empleado)
-- password_hash: guardar SOLO hash (bcrypt/argon2 desde Node.js)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id      BIGINT       NOT NULL,
    role_id          SMALLINT     NOT NULL,
    username         VARCHAR(50)  NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_attempts  SMALLINT     NOT NULL DEFAULT 0,
    locked_until     TIMESTAMPTZ,
    last_login_at    TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_employee UNIQUE (employee_id),
    CONSTRAINT fk_users_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id)
        REFERENCES roles (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_users_username ON users (LOWER(username));
CREATE INDEX idx_users_role ON users (role_id);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- CATEGORÍAS DE PRODUCTO
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_categories_name ON categories (LOWER(name));

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- PRODUCTOS
-- (supplier_id se agregará cuando exista la tabla suppliers)
-- ---------------------------------------------------------------------
CREATE TABLE products (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku           VARCHAR(50)   NOT NULL,
    barcode       VARCHAR(50),
    name          VARCHAR(200)  NOT NULL,
    description   TEXT,
    category_id   INTEGER,
    unit          VARCHAR(20)   NOT NULL DEFAULT 'pieza',
    cost_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
    sale_price    NUMERIC(12,2) NOT NULL,
    tax_rate      NUMERIC(5,2)  NOT NULL DEFAULT 16.00,
    stock_qty     NUMERIC(12,3) NOT NULL DEFAULT 0,
    min_stock     NUMERIC(12,3) NOT NULL DEFAULT 0,
    image_url     VARCHAR(500),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_by    BIGINT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id)
        REFERENCES categories (id) ON DELETE SET NULL,
    CONSTRAINT fk_products_created_by FOREIGN KEY (created_by)
        REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT ck_products_prices
        CHECK (cost_price >= 0 AND sale_price >= 0),
    CONSTRAINT ck_products_tax CHECK (tax_rate >= 0 AND tax_rate <= 100),
    CONSTRAINT ck_products_stock CHECK (stock_qty >= 0 AND min_stock >= 0)
);

CREATE UNIQUE INDEX uq_products_barcode
    ON products (barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_name ON products (LOWER(name));
CREATE INDEX idx_products_active ON products (is_active) WHERE is_active;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;