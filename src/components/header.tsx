import logo from '../assets/idea.png';
import woman from '../assets/woman.png';

export default function Header() {
    return (
        <header className='w-full h-auto flex items-center justify-between mb-8 gap-5 animate-sway'>
            <section className='flex items-center gap-4'>
                <img src={logo} alt="Logo" className='size-12' />
                <h1 className='text-3xl'><b>CrudTalens</b></h1>
            </section>

            <section className='flex items-center gap-2'>
                <img src={woman} alt="Imagen de perfil" />
                <div>
                    <p className='text-xl'>Carolina</p>
                    <p className='text-sm text-blue-400'>Administradora</p>
                </div>
            </section>
        </header>
    )
};