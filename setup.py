from setuptools import setup, find_packages


version = __import__('terminal').__version__

setup(
    name='django-terminal',
    packages=find_packages(),
    include_package_data=True,
    version=version,
    description='In browser terminal for Django ',
    author='synw',
    author_email='synwe@yahoo.com',
    url='https://github.com/synw/django-terminal',
    download_url='https://github.com/synw/django-terminal/releases/tag/' + version,
    keywords=['django', 'terminal'],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Framework :: Django :: 1.11',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.6',
    ],
    install_requires=[
        'django-instant>=0.6',
        "blessings",
    ],
    zip_safe=False
)
