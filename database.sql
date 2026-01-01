CREATE TABLE public.pacientes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nome text,
  telefone bigint UNIQUE,
  email text UNIQUE,
  data_nascimento date,
  sexo text,
  altura real,
  peso real,
  CONSTRAINT pacientes_pkey PRIMARY KEY (id)
);

CREATE TABLE public.consultas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  data date,
  paciente_id bigint,
  CONSTRAINT consultas_pkey PRIMARY KEY (id),
  CONSTRAINT consultas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id)
);

CREATE TABLE public.observacoes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  observacao text,
  consulta_id bigint,
  CONSTRAINT observacoes_pkey PRIMARY KEY (id),
  CONSTRAINT observacoes_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consultas(id)
);
