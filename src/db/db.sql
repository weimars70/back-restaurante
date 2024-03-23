se colcan los sql de insercion de data ya que las migraciones crean las tablas

INSERT INTO roles(
	nombre,
    route,
    fecha_creacion,
    fecha_actualizacion
)
VALUES(
	'RESTAURANTE',
    '/restaurant/orders/list',
    current_timestamp,
    current_timestamp
);

INSERT INTO roles(
	nombre,
    route,
    fecha_creacion,
    fecha_actualizacion
)
VALUES(
	'REPARTIDOR',
    '/delivery/orders/list',
    current_timestamp,
    current_timestamp
);

INSERT INTO roles(
	nombre,
    route,
    fecha_creacion,
    fecha_actualizacion
)
VALUES(
	'CLIENTE',
    '/client/products/list',
    current_timestamp,
    current_timestamp
);