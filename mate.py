print("====Mate discreta====")
print("====6190-26-4051=====")
print("====Jose Barrera=====")

print("1. Fibonacci")
print("2. Numero primo")
print("3. Factorial")

opcion = int(input("Elige una opcion (1, 2 o 3): "))

if opcion == 1:
    numero = int(input("Ingresa un numero: "))

    a = 0
    b = 1

    print("Serie de Fibonacci:")

    for i in range(numero + 1):
        print(a, end=" ")
        siguiente = a + b
        a = b
        b = siguiente

    print()
    print("El total de terminos mostrados es:", numero + 1)

elif opcion == 2:
    numero = int(input("Ingresa un numero: "))

    es_primo = True

    if numero < 2:
        es_primo = False
    else:
        for i in range(2, numero):
            if numero % i == 0:
                es_primo = False
                break

    if es_primo:
        print(numero, "es un numero primo")
    else:
        print(numero, "no es un numero primo")

elif opcion == 3:
    numero = int(input("Ingresa un numero: "))

    factorial = 1
    operacion = ""

    for i in range(numero, 0, -1):
        factorial = factorial * i
        if i == 1:
            operacion = operacion + str(i)
        else:
            operacion = operacion + str(i) + " x "

    print(operacion, "=", factorial)

else:
    print("Opcion no valida")