import React, { useEffect, useState } from 'react';
import PageDefault from '../../../components/PageDefault';
import { Link, useHistory } from 'react-router-dom';
import useForm from '../../../hooks/useForm';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import videoRepository from '../../../repositories/videos';
import categoriasRepository from '../../../repositories/categorias';

function CadastroVideo() {
    const history = useHistory();

    const [categorias, setCategorias] = useState([]);

    const { handleChange, values } = useForm({
        titulo: 'Video padrao',
        url: 'https://www.youtube.com/watch?v=W6LCYTBW0aY',
        categoria: 'Front-End'
    });

    useEffect(() => {
        categoriasRepository.getAll()
            .then((categorias) => {
                setCategorias(categorias);
            });
    }, []);

    return (
        <PageDefault>

            <h1>Cadastro de Video</h1>
            <form onSubmit={(e) => {
                e.preventDefault();

                const categoriaEscolhida = categorias.find((categoria) => {
                    return categoria.titulo === values.categoria;
                });
                console.log('categoria Escolhida', categoriaEscolhida);
                videoRepository.create({
                    titulo: values.titulo,
                    url: values.url,
                    categoriaId: categoriaEscolhida.categoriaId,
                }).then(() => {
                    history.push('/');
                });


            }}>

                <FormField
                    label="Titulo do video"
                    name="titulo"
                    type="text"
                    value={values.titulo}
                    onChange={handleChange}
                />

                <FormField
                    label="URL do video"
                    name="url"
                    type="text"
                    value={values.url}
                    onChange={handleChange}
                />

                <FormField
                    label="Categoria"
                    name="categoria"
                    value={values.categoria}
                    onChange={handleChange}
                />

                <Button type="submit">Cadastrar</Button>
            </form>


            <Link to="/cadastro/categoria">
                Cadastrar Categoria
            </Link>
        </PageDefault>
    )
}

export default CadastroVideo;