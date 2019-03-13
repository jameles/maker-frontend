import styled from 'styled-components'
import Router from 'next/router'
import { Mutation } from 'react-apollo'
import { createExam } from '../../apollo/mutation/createExam'
import { examsByUser } from '../../apollo/query/examsByUser'
import { BannerTop, BannerTitle } from '../Shared/Banner'
import { RedButton } from '../Shared/RedButton'
import Input from '../Shared/Input'

const CreateExamStyles = styled.div``

const MainContent = styled.div`
  width: ${props => props.theme.maxWidth};
  margin: 3rem auto;
  .create {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5rem;
  }
`

export default class CreateExam extends React.PureComponent {
  state = {
    title: ''
  }

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  onClick = async createExam => {
    const { title } = this.state
    const res = await createExam({
      variables: { data: { title } }
    })
    Router.push({ pathname: '/maker', query: { id: res.data.createExam.id } })
  }

  onKeyDown = async ({ keyCode }, createExam) => {
    if (keyCode === 13) {
      const { title } = this.state
      if (!title) {
        return alert('Exam title is required')
      }
      const res = await createExam({
        variables: { data: { title } }
      })
      Router.push({ pathname: '/maker', query: { id: res.data.createExam.id } })
    }
  }

  render() {
    const {
      props: { user },
      state: { title }
    } = this
    return (
      <CreateExamStyles>
        <BannerTop>
          <BannerTitle>Create Exam</BannerTitle>
        </BannerTop>
        <Mutation
          mutation={createExam}
          awaitRefetchQueries={true}
          refetchQueries={[{ query: examsByUser, variables: { id: user.id } }]}
        >
          {(createExam, { loading }) => (
            <MainContent>
              <div className="create">
                <Input
                  type="input"
                  width={300}
                  label="Exam Title"
                  value={title}
                  inputProps={{
                    type: 'text',
                    name: 'title',
                    maxLength: 50,
                    autoFocus: true,
                    spellCheck: false,
                    onKeyDown: e => this.onKeyDown(e, createExam)
                  }}
                  onChange={this.onChange}
                />
                <RedButton
                  disabled={loading || !Boolean(title)}
                  onClick={() => this.onClick(createExam)}
                >
                  create exam
                </RedButton>
              </div>
            </MainContent>
          )}
        </Mutation>
      </CreateExamStyles>
    )
  }
}
